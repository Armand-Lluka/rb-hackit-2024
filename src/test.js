import 'dotenv/config';
import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";

// Shared AWS configuration
const awsConfig = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
};

// Ensure the bucket name is retrieved and not undefined
const bucket = process.env.AWS_S3_BUCKET;

// Initialize S3 and Rekognition clients with shared configuration
const s3Client = new S3Client(awsConfig);
const rekognitionClient = new RekognitionClient(awsConfig);

const main = async () => {
  try {
    const listObjectsCommand = new ListObjectsCommand({ Bucket: bucket });
    const data = await s3Client.send(listObjectsCommand);
    console.log('Photo names in the bucket:');
    
    const imageFilePattern = /\.(jpg|jpeg|png|gif)$/i;
    const imageFiles = data.Contents.filter(file => imageFilePattern.test(file.Key));

    if (imageFiles.length === 0) {
      console.log('No image files found in the bucket.');
      return;
    }

    const firstImageFile = imageFiles[0];
    console.log(firstImageFile.Key);

    const detectLabelsCommand = new DetectLabelsCommand({
      Image: { S3Object: { Bucket: bucket, Name: firstImageFile.Key } }
    });

    try {
      const labelsData = await rekognitionClient.send(detectLabelsCommand);
      console.log(`Detected labels for: ${firstImageFile.Key}`);
      labelsData.Labels.forEach(label => {
        console.log(`Label:      ${label.Name}`);
        console.log(`Available properties on label: ${Object.keys(label).join(', ')}`);
        console.log('--------------------------------------------------');
      });
    } catch (labelError) {
      console.error(`Error detecting labels for image ${firstImageFile.Key}:`, labelError);
    }
  } catch (error) {
    console.error(error);
  }
};

main();