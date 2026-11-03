import { brand } from '../../components/brand.js';
export function welcomePage() {
 return `
 <main class="welcome" id="main-content"><div class="welcome__ambient" aria-hidden="true"></div><div class="welcome__inner">
 ${brand()}
 <section class="welcome__hero" aria-labelledby="welcome-title">
 <div class="welcome__image"><img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1400&q=90&fit=crop&crop=center" alt="Juicy double cheeseburger with fresh lettuce, tomato and toasted brioche bun" fetchpriority="high"><span class="welcome__image-shade" aria-hidden="true"></span><span class="welcome__image-caption"><i></i> FRESHLY PREPARED · ALWAYS DELICIOUS</span></div>
 <div class="welcome__copy"><p class="eyebrow">YOUR NEXT FAVOURITE MEAL</p><h1 id="welcome-title">Delicious Food,<br><em>Delivered Fresh.</em></h1><p class="welcome__description">Made fresh, packed with flavour, and brought straight to your door.</p></div></section>
 <div class="welcome__actions" aria-label="Get started"><a class="button button--primary" href="#/home">Get Started <span class="button__icon" aria-hidden="true">→</span></a><a class="button button--secondary" href="#/sign-in">Sign In</a><a class="button button--quiet" href="#/home">Continue as guest</a></div>
 <p class="welcome__footnote"><span aria-hidden="true">✦</span> A better bite is just a tap away.</p></div></main>`;
}