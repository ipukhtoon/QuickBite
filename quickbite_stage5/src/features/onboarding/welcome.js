import { brand } from '../../components/brand.js';

export function welcomePage() {
  return `
    <main class="welcome" id="main-content">
      <div class="welcome__ambient" aria-hidden="true"></div>
      <div class="welcome__inner">
        ${brand()}
        <section class="welcome__hero" aria-labelledby="welcome-title">
          <div class="welcome__image" role="img" aria-label="Food photography will be added from the approved QuickBite image library">
            <div class="welcome__image-orbit welcome__image-orbit--one"></div>
            <div class="welcome__image-orbit welcome__image-orbit--two"></div>
            <span class="asset-note">SIGNATURE FOOD PHOTOGRAPHY<br><b>ASSET INTEGRATION · P4</b></span>
          </div>
          <div class="welcome__copy">
            <p class="eyebrow">FRESHLY MADE · MADE FOR YOU</p>
            <h1 id="welcome-title">Good food.<br><em>Great moments.</em></h1>
            <p class="welcome__description">Discover the dishes worth slowing down for. Your next favourite meal starts here.</p>
          </div>
        </section>
        <div class="welcome__actions" aria-label="Get started">
          <a class="button button--primary" href="#/home">Explore QuickBite <span class="button__icon" aria-hidden="true">↗</span></a>
          <a class="button button--secondary" href="#/sign-in">Sign in</a>
          <a class="button button--quiet" href="#/home">Continue as guest</a>
        </div>
        <p class="welcome__footnote">A little something delicious is on its way.</p>
      </div>
    </main>`;
}
