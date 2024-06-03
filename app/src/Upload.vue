<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  CosmosButton,
  CosmosFlag,
  CosmosIconFormatQuote,
  CosmosIconMenu,
  CosmosIconUserFilled,
  CosmosMode,
  CosmosText,
  CosmosTitle,
  CosmosInput
} from '@cosmos/web/vue';
import { Ref } from 'vue';

import Image from './components/Image.vue';
import './style.css';
import { GravityFileInput, GravityWidget } from '@gravity/web-components-vue3';
import { GravityFileInputCustomEvent } from '@gravity/web-components';

export default defineComponent({
  components: {
    CosmosButton,
    CosmosFlag,
    CosmosIconFormatQuote,
    CosmosIconMenu,
    CosmosIconUserFilled,
    CosmosMode,
    CosmosText,
    CosmosTitle,
    Image,
    CosmosInput,
    GravityFileInput,
    GravityWidget
  },
  setup() {


    const imageBlob: Ref<string | null> = ref(null);
    const updateImageSrc = (event: GravityFileInputCustomEvent<FileList | null>) => {
      console.log(event.detail);
      const image = URL.createObjectURL(event.detail![0]);
      imageBlob.value = image;
    }

    return { updateImageSrc, imageBlob }
  }
});

</script>

<template>
  <CosmosMode mode="light">
    <section class="form">
      <gravity-widget class="widget" :drag-handle="true" heading="Image Upload" :body-padding="true">
        <div slot="body">
          <GravityFileInput id="fileUpload" button-label="Choose File" label="File Input" size="medium" accept="image/*"
            @fileChange="updateImageSrc"></GravityFileInput>
          <div v-if="imageBlob">
            <Image style="max-width: 800px" :src="imageBlob" id="image" />
          </div>
        </div>
      </gravity-widget>
    </section>
  </CosmosMode>
</template>

<style>
.widget {
  min-width: 80vw;
}

section {
  display: block;
  margin: 50px auto;
  width: 100%;
}

.form {
  justify-content: center;
  align-items: center;
  display: flex;
  flex: 1;
}
</style>
