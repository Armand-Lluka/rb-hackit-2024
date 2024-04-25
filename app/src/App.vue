<script lang="ts">
import { defineComponent } from 'vue';
import Image from './components/Image.vue';
import './style.css';

import {
  CosmosButton,
  CosmosFlag,
  CosmosIconFormatQuote,
  CosmosIconMenu,
  CosmosIconUserFilled,
  CosmosMode,
  CosmosText,
  CosmosTitle
} from '@cosmos/web/vue';

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
  },
});

</script>

<template>
  <CosmosMode mode="dark">
    <header>
      <a href="#" class="logo">
        <img
          src="./assets/redbull-racing-logo.png"
          alt="Red Bull Racing Logo"
        />
      </a>
      <nav class="header-nav">
        <RouterLink to="/products">
          <CosmosText size="small" weight="medium">Products</CosmosText>
        </RouterLink>
        <RouterLink to="/upload">
          <CosmosText size="small" weight="medium">File Upload</CosmosText>
        </RouterLink>
      </nav>
      <a href="#" class="user">
        <CosmosIconUserFilled></CosmosIconUserFilled>
      </a>
      <CosmosButton shape="circle" kind="tertiary" size="small" class="menu">
        <CosmosIconMenu></CosmosIconMenu>
      </CosmosButton>
    </header>
    <RouterView />
  </CosmosMode>
</template>

<style>
@import '../node_modules/@cosmos/foundation/lib/primitives/font/default.css';
</style>
