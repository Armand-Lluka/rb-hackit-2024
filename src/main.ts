import 'dotenv/config';
import { S3 } from 'aws-sdk';
import axios from 'axios';
import products from '../assets/products.json';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});

const bucket = 'rb-racing-products';

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
          Key: `products/${product.id}/${product.name}-${index + 1}.jpg`,
          Body: imageData.data,
          ContentType: 'image/jpeg',
          Metadata: {
            ProductId: product.id.toString(),
            ProductName: product.name,
            ProductPage: product.productPage,
          },
        };
      });

      // Upload images to S3
      const uploadPromises = imagesWithMetadata.map((image) => {
        s3.upload({ ...image, Bucket: bucket }).promise();
        console.log('Uploading image:', image.Key);
      });

      await Promise.all(uploadPromises);
      console.log(`Uploaded ${imagesWithMetadata.length} images`);
    }
    console.log('All images uploaded');
  } catch (error) {
    console.error('Error:', error);
  }
})();
