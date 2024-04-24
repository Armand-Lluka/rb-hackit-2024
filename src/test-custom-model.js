import 'dotenv/config';
import fs from 'fs/promises';
import { RekognitionClient, DetectCustomLabelsCommand } from "@aws-sdk/client-rekognition";

// Shared AWS configuration
const awsConfig = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
};

// Initialize Rekognition client with shared configuration
const rekognitionClient = new RekognitionClient(awsConfig);

const main = async () => {
  const imageFilePath = 'assets/test-image.jpg';
  const projectVersionArn = process.env.AWS_ARN_TEST_CUSTOM_MODEL;

  try {
    const imageBytes = await fs.readFile(imageFilePath);
    const detectCustomLabelsCommand = new DetectCustomLabelsCommand({
      ProjectVersionArn: projectVersionArn,
      Image: { Bytes: imageBytes },
    });

    const customLabelsData = await rekognitionClient.send(detectCustomLabelsCommand);
    console.log(`Detected custom labels for: ${imageFilePath}`);
    customLabelsData.CustomLabels.forEach(label => {
      console.log(`Label:      ${label.Name}`);
      console.log(`Confidence: ${label.Confidence}`);
      console.log(`Available properties on label: ${Object.keys(label).join(', ')}`);
      console.log('--------------------------------------------------');
    });
  } catch (error) {
    console.error(`Error processing image ${imageFilePath}:`, error);
  }
};

main();
