import 'dotenv/config';
import { S3, Rekognition, config } from 'aws-sdk';
import fs from 'fs';
import axios from 'axios';

interface ImageMetadata {
  ProductId: string;
  ProductName: string;
  ProductPrice: string;
  ProductCurrency: string;
  ProductPage: string;
}

interface ImageS3Object {
  Bucket: string;
  Name: string;
}

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});

const rekognition = new Rekognition({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: 'us-east-1',
});

// rego

const products = [
  {
    id: 1,
    name: 'Replica Checo Perez Polo',
    price: 84.95,
    currency: 'EUR',
    currencySymbol: '€',
    productImages: [
      'https://assets.redbullshop.com/images/f_auto,q_auto/t_product-detail-3by4/products/RBR/2024/RBR24030_1H_M01/Replica-Checo-Perez-Polo.jpg',
      'https://assets.redbullshop.com/images/f_auto,q_auto/t_product-detail-3by4/products/RBR/2024/RBR24030_1H_M02/Replica-Checo-Perez-Polo.jpg',
      'https://assets.redbullshop.com/images/f_auto,q_auto/t_product-detail-3by4/products/RBR/2024/RBR24030_1H_1/Replica-Checo-Perez-Polo.jpg',
      'https://assets.redbullshop.com/images/f_auto,q_auto/t_product-detail-3by4/products/RBR/2024/RBR24030_1H_4/Replica-Checo-Perez-Polo.jpg',
    ],
    productPage:
      'https://www.redbullshop.com/en-int/p/Men/Replica-Checo-Perez-Polo/RBR24030/',
  },
];

const bucket = 'awesome-test-bucket-2024';

(async () => {
  try {
    for (const product of products) {
      const allImages = await Promise.all(
        product.productImages.map((image) =>
          axios.get(image, { responseType: 'arraybuffer' })
        )
      );

      const imagesWithMetadata = allImages.map((imageData, index) => {
        return {
          Key: `products/${product.id}/${index}.jpg`,
          Body: imageData.data,
          ContentType: 'image/jpeg',
          Metadata: {
            ProductId: product.id.toString(),
            ProductName: product.name,
            ProductPrice: product.price.toString(),
            ProductCurrency: product.currency,
            ProductPage: product.productPage,
          },
        };
      });

      // Upload images to S3
      const uploadPromises = imagesWithMetadata.map((image) =>
        s3.upload({ ...image, Bucket: bucket }).promise()
      );

      await Promise.all(uploadPromises);

      for (const imageMetadata of imagesWithMetadata) {
        console.log('Uploaded image with metadata:', imageMetadata.Metadata);

        const imageS3Object = {
          Bucket: bucket,
          Name: imageMetadata.Key,
        };

        // Use custom logic here to process image metadata (e.g., trigger Rekognition API)
        await processImageMetadata(imageS3Object, imageMetadata.Metadata);
      }

      // Use Rekognition to label images
      await createManifestFile();
    }
    console.log('Image labeling completed');
  } catch (error) {
    console.error('Error:', error);
  }
})();

async function processImageMetadata(
  imageS3Object: ImageS3Object,
  metadata: ImageMetadata
) {
  const taggingParams = {
    Bucket: imageS3Object.Bucket,
    Key: imageS3Object.Name,
    Tagging: {
      TagSet: [
        {
          Key: 'ProductId',
          Value: metadata.ProductId,
        },
        {
          Key: 'ProductName',
          Value: metadata.ProductName,
        },
        {
          Key: 'ProductPrice',
          Value: metadata.ProductPrice,
        },
        {
          Key: 'ProductCurrency',
          Value: metadata.ProductCurrency,
        },
        {
          Key: 'ProductPage',
          Value: metadata.ProductPage,
        },
      ],
    },
  };

  try {
    await s3.putObjectTagging(taggingParams).promise();
    console.log(`Successfully tagged ${imageS3Object.Name}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log(err); // an error occurred
    }
  }
}

async function createManifestFile() {
  const objects = await s3.listObjectsV2({ Bucket: bucket }).promise();
  const manifest = [] as Record<string, unknown>[];

  for (const object of objects.Contents || []) {
    if (object.Key) {
      const tags = await s3
        .getObjectTagging({ Bucket: bucket, Key: object.Key })
        .promise();
      const metadata = {} as Record<string, string>;

      for (const tag of tags.TagSet || []) {
        metadata[tag.Key] = tag.Value;
      }

      manifest.push({
        'source-ref': `s3://${bucket}/${object.Key}`,
        label: metadata,
      });
    }
  }

  // push this to s3 bucket

  s3.upload(
    {
      Bucket: bucket,
      Key: 'data.manifest',
      Body: manifest.map((item) => JSON.stringify(item)).join('\n'),
    },
    (err, data) => {
      if (err) {
        console.error('Error uploading manifest:', err);
      } else {
        console.log('Manifest uploaded:', data);
      }
    }
  );

  fs.writeFileSync(
    'data.manifest',
    manifest.map((item) => JSON.stringify(item)).join('\n')
  );
  console.log('Manifest:', manifest);
}
