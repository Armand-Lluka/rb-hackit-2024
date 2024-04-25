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
import productsJSON from '../../../products.json';

interface ProductLabel {
  productId: string;
  productName: string;
  productPage: string;
  productImage: string;
  confidence: number | null;
  left: number | null;
  top: number | null;
  width: number | null;
  height: number | null;
}

export default defineComponent({
  name: 'ImageComponent',
  props: {
    src: {
      type: String as PropType<string>,
      required: true,
    },
    figcaption: String,
    athleteName: String,
    athleteAvatar: String,
    manualProductIds: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    manualLefts: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
    manualTops: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
  },
  components: {
    CosmosText,
    CosmosIconLabel,
    CosmosTooltip,
    CosmosProductItem,
  },
  setup(props) {
    const customLabels = ref<ProductLabel[]>([]);

    const awsConfig = {
      region: 'us-east-1',
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
      },
    };

    const rekognitionClient = new RekognitionClient(awsConfig);

    const fetchImageBytes = async (imageUrl: string): Promise<Uint8Array> => {
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    };

    const detectLabels = async (imageBytes: Uint8Array): Promise<void> => {
      const command = new DetectCustomLabelsCommand({
        ProjectVersionArn: import.meta.env.VITE_AWS_ARN_TEST_CUSTOM_MODEL,
        Image: { Bytes: imageBytes },
      });
      const { CustomLabels } = await rekognitionClient.send(command);
      return CustomLabels;
    };

    const processManualLabels = (): ProductLabel[] => {
      return props.manualProductIds
        .map((productId, index) => {
          const product = productsJSON.find((p) => p.id === productId);
          if (!product) return null;
          return {
            productId,
            productName: product.name || '',
            productPage: product.productPage || '',
            productImage: product.productImages?.[0] || '',
            confidence: null,
            left: props.manualLefts[index] || null,
            top: props.manualTops[index] || null,
            width: null,
            height: null,
          };
        })
        .filter((label): label is ProductLabel => label !== null);
    };

    const processDetectedLabels = (detectedLabels: any[]): ProductLabel[] => {
      const labelMap = new Map<string, ProductLabel>();
      detectedLabels.forEach((label) => {
        const product = productsJSON.find((p) => p.id === label.Name);
        if (!product) return;
        labelMap.set(label.Name, {
          productId: label.Name,
          productName: product.name || '',
          productPage: product.productPage || '',
          productImage: product.productImages?.[0] || '',
          confidence: label.Confidence,
          left: Number(
            (
              (label.Geometry.BoundingBox.Left +
                label.Geometry.BoundingBox.Width / 2) *
              100
            ).toFixed(2),
          ),
          top: Number(
            (
              (label.Geometry.BoundingBox.Top +
                label.Geometry.BoundingBox.Height / 2) *
              100
            ).toFixed(2),
          ),
          width: Number((label.Geometry.BoundingBox.Width * 100).toFixed(2)),
          height: Number((label.Geometry.BoundingBox.Height * 100).toFixed(2)),
        });
      });
      return Array.from(labelMap.values());
    };

    onMounted(async () => {
      try {
        if (props.manualProductIds.length) {
          customLabels.value = processManualLabels();
        } else {
          const imageUrl = new URL(props.src, import.meta.url).href;
          const imageBytes = await fetchImageBytes(imageUrl);
          const detectedLabels = await detectLabels(imageBytes);
          customLabels.value = processDetectedLabels(detectedLabels);
        }
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
          :href="label.productPage"
          :image="label.productImage"
          :name="label.productName"
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
