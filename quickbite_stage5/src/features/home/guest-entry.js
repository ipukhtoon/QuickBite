export function guestEntryPage() {
  return `
    <main class="phase-screen" id="main-content">
      <header class="phase-screen__top">
        <a class="brand brand--compact" href="#/" aria-label="QuickBite home"><span class="brand__mark" aria-hidden="true"><i></i><i></i><i></i></span><span class="brand__word">Quick<span>Bite</span></span></a>
        <span class="phase-badge">MENU BUILD · P4</span>
      </header>
      <section class="phase-card" aria-labelledby="guest-title">
        <p class="eyebrow">WELCOME, GUEST</p>
        <h1 id="guest-title">You're in.</h1>
        <p>Guest browsing is the next customer-flow milestone. The menu is not connected yet, so no products or prices are being shown as real.</p>
        <a class="button button--primary button--full" href="#/">Back to welcome</a>
      </section>
    </main>`;
}
