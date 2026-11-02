import { brand } from '../../components/brand.js';
import { field } from '../../components/field.js';

export function signInPage() {
  return `
    <main class="auth-page" id="main-content">
      <div class="auth-page__ambient" aria-hidden="true"></div>
      <div class="auth-wrap">
        <a class="back-link" href="#/" aria-label="Back to welcome">← <span>Back</span></a>
        ${brand()}
        <section class="auth-card" aria-labelledby="auth-title">
          <p class="eyebrow">WELCOME BACK</p>
          <h1 id="auth-title">Good to see you.</h1>
          <p class="auth-card__intro">Sign in to pick up where your cravings left off.</p>
          <form id="sign-in-form" novalidate>
            ${field({ id: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', autocomplete: 'email' })}
            ${field({ id: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', autocomplete: 'current-password' })}
            <div class="auth-options auth-options--end">
              <button class="text-button" type="button" id="forgot-password">Forgot password?</button>
            </div>
            <button class="button button--primary button--full" type="submit">Sign in <span class="button__icon" aria-hidden="true">→</span></button>
            <p class="form-feedback" id="sign-in-feedback" role="status" aria-live="polite"></p>
          </form>
          <p class="auth-switch">New to QuickBite? <a href="#/create-account">Create an account</a></p>
        </section>
        <p class="auth-guest">Just browsing? <a href="#/home">Continue as guest</a></p>
      </div>
    </main>`;
}

export function createAccountPage() {
  return `
    <main class="auth-page auth-page--signup" id="main-content">
      <div class="auth-page__ambient" aria-hidden="true"></div>
      <div class="auth-wrap">
        <a class="back-link" href="#/" aria-label="Back to welcome">← <span>Back</span></a>
        ${brand()}
        <section class="auth-card" aria-labelledby="auth-title">
          <p class="eyebrow">JOIN THE TABLE</p>
          <h1 id="auth-title">Make it yours.</h1>
          <p class="auth-card__intro">Create an account for a smoother way to order.</p>
          <form id="create-account-form" novalidate>
            ${field({ id: 'full-name', label: 'Full name', placeholder: 'Your name', autocomplete: 'name' })}
            ${field({ id: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', autocomplete: 'email' })}
            ${field({ id: 'phone', label: 'Phone number', type: 'tel', placeholder: '03XX XXXXXXX', autocomplete: 'tel', inputmode: 'tel' })}
            ${field({ id: 'password', label: 'Password', type: 'password', placeholder: 'At least 8 characters', autocomplete: 'new-password', hint: 'Use at least 8 characters.', minlength: 8 })}
            <button class="button button--primary button--full" type="submit">Create account <span class="button__icon" aria-hidden="true">→</span></button>
            <p class="form-feedback" id="create-account-feedback" role="status" aria-live="polite"></p>
          </form>
          <p class="auth-switch">Already have an account? <a href="#/sign-in">Sign in</a></p>
        </section>
        <p class="auth-guest">Prefer not to register? <a href="#/home">Continue as guest</a></p>
      </div>
    </main>`;
}

export function bindAuthPage(route) {
  if (route === '/sign-in') {
    const form = document.querySelector('#sign-in-form');
    const feedback = document.querySelector('#sign-in-feedback');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      feedback.textContent = 'Sign-in is not connected yet. Your details have not been sent or saved.';
      feedback.dataset.kind = 'info';
    });
    document.querySelector('#forgot-password')?.addEventListener('click', () => {
      feedback.textContent = 'Password recovery will be available when the secure account service is connected.';
      feedback.dataset.kind = 'info';
    });
  }

  if (route === '/create-account') {
    const form = document.querySelector('#create-account-form');
    const feedback = document.querySelector('#create-account-feedback');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const password = form.elements.password.value;
      if (password.length < 8) {
        feedback.textContent = 'Please use a password with at least 8 characters.';
        feedback.dataset.kind = 'error';
        form.elements.password.focus();
        return;
      }
      feedback.textContent = 'Account creation is not connected yet. Your details have not been sent or saved.';
      feedback.dataset.kind = 'info';
    });
  }
}
