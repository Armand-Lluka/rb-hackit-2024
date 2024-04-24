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
  const imageFilePath = 'assets/test-image-max.jpeg';
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
      console.log(`Geometry: ${JSON.stringify(label.Geometry)}`);
      
      // Extract and log the bounding box coordinates in percentages
      const { BoundingBox } = label.Geometry;
      const coordinates = {
        left: (BoundingBox.Left * 100).toFixed(2),
        top: (BoundingBox.Top * 100).toFixed(2),
        width: (BoundingBox.Width * 100).toFixed(2),
        height: (BoundingBox.Height * 100).toFixed(2)
      };
      const script = `
        const figure = document.querySelector('figure');
        const rect = document.createElement('div');
        rect.style.position = 'absolute';
        rect.style.left = '${coordinates.left}%';
        rect.style.top = '${coordinates.top}%';
        rect.style.width = '${coordinates.width}%';
        rect.style.height = '${coordinates.height}%';
        rect.style.border = '2px solid red';
        rect.style.boxSizing = 'border-box';
        figure.appendChild(rect);
      `;
      console.log(script);
      console.log(`Coordinates: ${JSON.stringify(coordinates)}`);
      
      console.log(`Available properties on label: ${Object.keys(label).join(', ')}`);
      console.log('--------------------------------------------------');
    });
  } catch (error) {
    console.error(`Error processing image ${imageFilePath}:`, error);
  }
};

main();
