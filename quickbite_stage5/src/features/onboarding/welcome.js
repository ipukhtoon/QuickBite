import { brand } from '../../components/brand.js';

export function welcomePage() {
  return `
    <main class="welcome" id="main-content">
      <div class="welcome__ambient" aria-hidden="true"></div>
      <div class="welcome__inner">
        ${brand()}
        <section class="welcome__hero" aria-labelledby="welcome-title">
          <div class="welcome__image">
            <img class="welcome__food-photo" src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1400&q=90&fit=crop" alt="Juicy double cheeseburger with fresh lettuce and tomato" fetchpriority="high">
            <span class="welcome__image-shade" aria-hidden="true"></span>
            <span class="welcome__image-label"><i></i> FRESHLY PREPARED <b>·</b> ALWAYS DELICIOUS</span>
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
