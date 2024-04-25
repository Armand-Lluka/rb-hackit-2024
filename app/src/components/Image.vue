<script lang="ts">
import { defineComponent, PropType, onMounted, ref } from 'vue';
import {
  CosmosIconLabel,
  CosmosText,
  CosmosTooltip,
  CosmosProductItem,
} from '@cosmos/web/vue';
import {
  RekognitionClient,
  DetectCustomLabelsCommand,
} from '@aws-sdk/client-rekognition';
import { S3Client } from '@aws-sdk/client-s3';

export default defineComponent({
  name: 'Image',
  props: {
    src: {
      type: String as PropType<string>,
      required: true,
    },
    figcaption: {
      type: String as PropType<string>,
      default: '',
    },
    athleteName: {
      type: String as PropType<string>,
      default: '',
    },
    athleteAvatar: {
      type: String as PropType<string>,
      default: '',
    },
  },
  components: {
    CosmosText,
    CosmosIconLabel,
    CosmosTooltip,
    CosmosProductItem,
  },
  setup(props) {
    const customLabels = ref([]);

    const awsConfig = {
      region: 'us-east-1',
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
      },
    };

    const rekognitionClient = new RekognitionClient(awsConfig);
    const s3Client = new S3Client(awsConfig);

    onMounted(async () => {
      try {
        const imageUrl = new URL(props.src, import.meta.url).href;
        const imageResponse = await fetch(imageUrl);
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        const imageBytes = new Uint8Array(imageArrayBuffer);
        const detectCustomLabelsCommand = new DetectCustomLabelsCommand({
          ProjectVersionArn: import.meta.env.VITE_AWS_ARN_TEST_CUSTOM_MODEL,
          Image: { Bytes: imageBytes },
        });

        const customLabelsData = await rekognitionClient.send(
          detectCustomLabelsCommand,
        );

        const labelMap = new Map();

        for (const label of customLabelsData.CustomLabels) {
          const existingLabel = labelMap.get(label.Name);
          if (!existingLabel || existingLabel.Confidence < label.Confidence) {
            labelMap.set(label.Name, {
              productId: label.Name,
              confidence: label.Confidence,
              left: (label.Geometry.BoundingBox.Left * 100).toFixed(2),
              top: (label.Geometry.BoundingBox.Top * 100).toFixed(2),
              width: (label.Geometry.BoundingBox.Width * 100).toFixed(2),
              height: (label.Geometry.BoundingBox.Height * 100).toFixed(2),
              productLabel: '',
            });
          }
        }

        customLabels.value = Array.from(labelMap.values());

        // Log the customLabels after it's been determined
        console.log('Custom Labels:', customLabels.value);
      } catch (error) {
        console.error(`Error processing image ${props.src}:`, error);
      }
    });

    return { customLabels };
  },
});
</script>

<template>
  <div class="container">
    <figure>
      <img :src="src" :alt="figcaption" />
      <figcaption v-if="figcaption">
        <CosmosText size="x-small">{{ figcaption }}</CosmosText>
        <CosmosText kind="subtle" size="xx-small">© Getty Images</CosmosText>
      </figcaption>

      <CosmosTooltip
        v-for="label in customLabels"
        :key="label.name"
        appearance="light"
      >
        <CosmosProductItem
          appearance="dark"
          href="https://www.redbullshop.com/en-int/p/RBS-Fanblock-Cap/RBS23037/?preselectedVariant=M-165921"
          image="https://assets.codepen.io/2454492/product-item-image-1.jpg"
          :name="label.productId"
          slot="content"
          target="_blank"
          text="Unisex"
        ></CosmosProductItem>
        <div
          class="marker"
          :style="{
            left: `${Math.max(parseFloat(label.left), 10)}%`,
            top: `${Math.max(parseFloat(label.top), 10)}%`,
          }"
        ></div>
      </CosmosTooltip>

      <div class="badges">
        <a class="badge" v-if="athleteName && athleteAvatar">
          <img :src="athleteAvatar" :alt="athleteName" />
          <CosmosText size="x-small">{{ athleteName }}</CosmosText>
        </a>
        <button class="badge">
          <CosmosIconLabel></CosmosIconLabel>
          <CosmosText size="x-small">Tagged Products</CosmosText>
        </button>
      </div>
    </figure>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
  align-items: center;
}
figure {
  all: unset;
  max-height: 100%;
  max-width: 100%;
  position: relative;
}
img {
  max-height: 100%;
  max-width: 100%;
}
figcaption {
  position: absolute;
  margin-top: 8px;
  display: grid;
  gap: 4px;
}
.badges {
  bottom: 8px;
  display: flex;
  gap: 6px;
  left: 8px;
  position: absolute;
}
.badge {
  all: unset;
  align-items: center;
  backdrop-filter: blur(6px);
  background-color: rgba(0, 22, 43, 0.8);
  border-radius: 999px;
  cursor: pointer;
  display: flex;
  gap: 8px;
  padding: 4px 8px 4px 4px;
}
.badge img {
  aspect-ratio: 1;
  border-radius: 999px;
  object-fit: cover;
  width: 20px;
}
.marker {
  --color: rgb(27, 106, 238);
  --markerSize: 10px;
  --transparentBlue: rgba(95, 139, 250, 0);
  animation: pulsing 2s infinite;
  background: var(--color);
  border-radius: 50%;
  box-shadow: 0 0 0 var(--color);
  cursor: pointer;
  height: var(--markerSize);
  position: absolute;
  transition: all 0.2s;
  width: var(--markerSize);
}

.marker:active {
  transform: scale(1.5);
}

@keyframes pulsing {
  from {
    box-shadow: 0 0 0 0 var(--color);
  }
  70% {
    box-shadow: 0 0 0 var(--markerSize) var(--transparentBlue);
  }
  to {
    box-shadow: 0 0 0 0 var(--transparentBlue);
  }
}
</style>
