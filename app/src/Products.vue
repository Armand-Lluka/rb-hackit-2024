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
  CosmosTitle,
} from '@cosmos/web/vue';
import { RouterLink } from 'vue-router';

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
    <section class="intro">
      <div class="intro-content">
        <img
          src="./assets/shanghai-international-circuit.avif"
          alt=""
          class="circuit"
        />
        <CosmosTitle size="x-large">2024 Chinese Grand Prix</CosmosTitle>
        <CosmosTitle size="medium">19 - 22 April 2024</CosmosTitle>
        <CosmosText>
          <CosmosFlag code="CN" style="margin-right: 4px"></CosmosFlag>
          Shanghai International Circuit, China
        </CosmosText>
        <div class="reports">
          <CosmosButton shape="rectangle">Sunday Report</CosmosButton>
          <CosmosButton shape="rectangle" kind="tertiary"
            >Saturday Schedule</CosmosButton
          >
          <CosmosButton shape="rectangle" kind="tertiary"
            >Friday Schedule</CosmosButton
          >
        </div>
      </div>
    </section>
    <section class="split text">
      <CosmosTitle kind="subtle" size="large">01</CosmosTitle>
      <div class="content">
        <CosmosTitle spacing="long-form-bottom">A Look At Shanghai</CosmosTitle>
        <CosmosText spacing="long-form-top">
          <span
            >After a four-season break from the Shanghai International Circuit
            the teams are back and ready to race at this tight, twisty track
            with long, flat-out straights.</span
          >
        </CosmosText>
        <CosmosText spacing="long-form-top">
          <span>
            The Chinese Grand Prix joined Formula One in 2004, one year before
            Oracle Red Bull Racing entered the scene, and one of the Team’s
            greatest moments happened in Shanghai. In 2009 Sebastian Vettel took
            the Team’s first pole on the Saturday and then the first win for the
            Team on the Sunday. Mark Webber brought his RB5 home in P2. So, in
            one weekend the Bulls went from never claiming a pole or a win to
            collecting both and a one-two finish to top it off. Red Bull Racing
            had arrived!
          </span>
        </CosmosText>
      </div>
    </section>
    <section class="split">
      <Image
        :manual-product-ids="['RBR24067']"
        :manual-lefts="[40]"
        :manual-tops="[20]"
        athlete-avatar="/src/assets/max-avatar.jpg"
        athlete-name="Max Verstappen"
        figcaption="Max Ready For China"
        src="/src/assets/max-ready-for-china.jpg"
      />
      <div class="quote">
        <CosmosIconFormatQuote></CosmosIconFormatQuote>
        <CosmosTitle size="large">
          <span
            >It is a great racing track in China and has a unique layout, with
            trickier corners and the long straights presenting lots of
            opportunities for overtaking
          </span>
        </CosmosTitle>
      </div>
    </section>
    <section class="split text">
      <CosmosTitle kind="subtle" size="large">02</CosmosTitle>
      <div class="content">
        <CosmosTitle spacing="long-form-bottom">Race Schedule</CosmosTitle>
        <img src="./assets/schedule.png" alt="" />
      </div>
    </section>
    <section class="split">
      <div class="quote">
        <CosmosIconFormatQuote></CosmosIconFormatQuote>
        <CosmosTitle size="large">
          <span
            >Japan really proved to me how confident I feel with this car and
            the performance I can extract from it
          </span>
        </CosmosTitle>
      </div>
      <Image
        src="/src/assets/sergio-perez-bahrain-grand-prix-2024.jpg"
        figcaption="Bahrain Grand Prix 2024"
        :manual-product-ids="['RBR23258']"
        :manual-lefts="[35]"
        :manual-tops="[71]"
      />
    </section>
    <section class="hero">
      <Image
        :manual-lefts="[58]"
        :manual-product-ids="['RBR24311']"
        :manual-tops="[19]"
        athlete-avatar="/src/assets/checo-avatar.jpg"
        athlete-name="Sergio Perez"
        figcaption="Checo's Confidence Shines"
        src="/src/assets/chestappen-delights-in-china.jpg"
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
</template>

<style>
@import '../node_modules/@cosmos/foundation/lib/primitives/font/default.css';
</style>
