<script lang="ts">
import { defineComponent } from 'vue';
import {
  CosmosButton,
  CosmosText,
  CosmosMode,
  CosmosIconMenu,
  CosmosIconUserFilled,
} from '@cosmos/web/vue';
import Image from './components/Image.vue';
import './style.css';

export default defineComponent({
  components: {
    CosmosButton,
    CosmosText,
    CosmosMode,
    CosmosIconMenu,
    CosmosIconUserFilled,
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
        <a href="#">
          <CosmosText size="small" weight="medium">Races</CosmosText>
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium">Cars</CosmosText>
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium">Shop</CosmosText>
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium">The Paddock</CosmosText>
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium">F1 Academy</CosmosText>
        </a>
      </nav>
      <a href="#" class="user">
        <CosmosIconUserFilled></CosmosIconUserFilled>
      </a>
      <CosmosButton shape="circle" kind="tertiary" size="small" class="menu">
        <CosmosIconMenu></CosmosIconMenu>
      </CosmosButton>
    </header>
    <section>
      <Image
        src="/src/assets/max-ready-for-china.avif"
        alt="Max ready for China"
      />
    </section>
    <footer>
      <nav class="footer-nav">
        <a href="#">
          <CosmosText size="small" weight="medium">Contact Us</CosmosText>
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium">Jobs</CosmosText>
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium">Media</CosmosText>
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium">Red Bull Shop</CosmosText>
        </a>
      </nav>
      <nav class="footer-nav">
        <a href="#">
          <CosmosText size="small" weight="medium">Cookie Settings</CosmosText>
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium">Privacy Policy</CosmosText>
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium">Media</CosmosText>
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium"
            >Website Terms of Use</CosmosText
          >
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium">Imprint</CosmosText>
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium"
            >Gender Pay Report</CosmosText
          >
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium"
            >Modern Slavery Statement</CosmosText
          >
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium">Sustainability</CosmosText>
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium"
            >Diversity & Inclusion</CosmosText
          >
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium"
            >Safety, Health and Environment Policy</CosmosText
          >
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium">UK Tax Strategy</CosmosText>
        </a>
        <a href="#">
          <CosmosText size="small" weight="medium"
            >The Paddock Terms And Conditions</CosmosText
          >
        </a>
      </nav>
      <CosmosText kind="subtle" size="small"
        >© 2024 Red Bull Racing Ltd</CosmosText
      >
    </footer>
  </CosmosMode>
</template>
