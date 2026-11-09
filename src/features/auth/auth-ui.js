import { isFirebaseConfigured } from '../../services/firebase/config.js';

const errorMessages = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/weak-password': 'Choose a stronger password with at least 8 characters.',
  'auth/user-disabled': 'This account is currently disabled. Contact the restaurant.',
  'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
  'auth/network-request-failed': 'A network connection is required. Check your internet and try again.',
};

function friendlyError(error) {
  return errorMessages[error?.code] || 'We could not complete that request. Please try again.';
}

export function initAuthUI() {
  const dialog = document.getElementById('accountDialog');
  const guestPanel = document.getElementById('accountGuestPanel');
  const signedInPanel = document.getElementById('accountSignedInPanel');
  const message = document.getElementById('accountMessage');
  const signInForm = document.getElementById('signInForm');
  const registerForm = document.getElementById('registerForm');
  const signInTab = document.querySelector('[data-auth-view="signin"]');
  const registerTab = document.querySelector('[data-auth-view="register"]');
  const signInEmail = document.getElementById('signInEmail');
  let profileSyncUid = null;

  function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle('is-error', isError);
    message.hidden = !text;
  }

  function selectView(view) {
    const signingIn = view === 'signin';
    signInForm.hidden = !signingIn;
    registerForm.hidden = signingIn;
    signInTab.setAttribute('aria-pressed', String(signingIn));
    registerTab.setAttribute('aria-pressed', String(!signingIn));
    showMessage('');
  }

  document.querySelectorAll('[data-close-account]').forEach((button) => {
    button.addEventListener('click', () => dialog.close());
  });

  document.addEventListener('quickbite:open-account', () => {
    showMessage('');
    dialog.showModal();
  });

  signInTab.addEventListener('click', () => selectView('signin'));
  registerTab.addEventListener('click', () => selectView('register'));

  if (!isFirebaseConfigured()) {
    guestPanel.hidden = false;
    signedInPanel.hidden = true;
    signInForm.hidden = true;
    registerForm.hidden = true;
    signInTab.disabled = true;
    registerTab.disabled = true;
    document.getElementById('accountUnavailable').hidden = false;
    return;
  }

  (async () => {
    try {
      const auth = await import('../../services/firebase/auth.js');
      auth.observeAuthState((user) => {
        const signedIn = Boolean(user);
        guestPanel.hidden = signedIn;
        signedInPanel.hidden = !signedIn;
        document.getElementById('accountCloseAction').textContent = signedIn ? 'Close' : 'Continue as guest';
        if (signedIn) {
          document.getElementById('accountDisplayName').textContent = user.displayName || 'QuickBite customer';
          document.getElementById('accountEmail').textContent = user.email || '';
          if (profileSyncUid !== user.uid) {
            profileSyncUid = user.uid;
            auth.ensureCustomerProfile().catch(() => {
              showMessage('You are signed in, but your customer profile could not be synchronized. Please try again later.', true);
            });
          }
        } else {
          profileSyncUid = null;
        }
      }, () => showMessage('Your sign-in state could not be checked. Please reload.', true));

      signInForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submit = signInForm.querySelector('[type="submit"]');
        submit.disabled = true;
        showMessage('Signing in…');
        try {
          await auth.signInCustomer({
            email: signInEmail.value,
            password: document.getElementById('signInPassword').value,
          });
          signInForm.reset();
          showMessage('You are signed in.');
        } catch (error) {
          showMessage(friendlyError(error), true);
        } finally {
          submit.disabled = false;
        }
      });

      registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submit = registerForm.querySelector('[type="submit"]');
        submit.disabled = true;
        showMessage('Creating your account…');
        try {
          await auth.registerCustomer({
            displayName: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value,
          });
          registerForm.reset();
          showMessage('Your account has been created.');
        } catch (error) {
          showMessage(friendlyError(error), true);
        } finally {
          submit.disabled = false;
        }
      });

      document.getElementById('resetPasswordButton').addEventListener('click', async () => {
        const email = signInEmail.value.trim();
        if (!email) {
          showMessage('Enter your email address first, then request a password reset.', true);
          signInEmail.focus();
          return;
        }
        showMessage('Sending password reset email…');
        try {
          await auth.sendCustomerPasswordReset(email);
          showMessage('If an account exists for that email, a password reset message has been sent.');
        } catch (error) {
          showMessage(friendlyError(error), true);
        }
      });

      document.getElementById('signOutButton').addEventListener('click', async () => {
        try {
          await auth.signOutCustomer();
          showMessage('You have signed out.');
        } catch (error) {
          showMessage(friendlyError(error), true);
        }
      });
    } catch (error) {
      showMessage('Account services are unavailable right now. Please try again later.', true);
      console.error('QuickBite account initialization failed:', error);
    }
  })();
}
