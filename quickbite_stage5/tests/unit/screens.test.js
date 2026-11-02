import test from 'node:test';
import assert from 'node:assert/strict';
import { welcomePage } from '../../src/features/onboarding/welcome.js';
import { signInPage, createAccountPage } from '../../src/features/authentication/auth-pages.js';
import { guestEntryPage } from '../../src/features/home/guest-entry.js';

test('welcome screen exposes the three approved entry paths', () => {
  const html = welcomePage();
  assert.match(html, /href="#\/home"/);
  assert.match(html, /href="#\/sign-in"/);
  assert.match(html, /Continue as guest/);
});

test('sign-in screen has labelled email and password fields and no fake social providers', () => {
  const html = signInPage();
  assert.match(html, /for="email"/);
  assert.match(html, /type="email"/);
  assert.match(html, /for="password"/);
  assert.match(html, /Forgot password\?/);
  assert.doesNotMatch(html, /Continue with Google|Continue with Apple/);
});

test('registration screen includes required profile fields and minimum password length', () => {
  const html = createAccountPage();
  for (const id of ['full-name', 'email', 'phone', 'password']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /minlength="8"/);
});

test('guest entry clearly discloses that the menu is not yet connected', () => {
  const html = guestEntryPage();
  assert.match(html, /WELCOME, GUEST/);
  assert.match(html, /menu is not connected yet/i);
  assert.doesNotMatch(html, /\$\d|Rs\.?\s*\d/i);
});

import { homePage } from '../../src/features/home/home-page.js';
import { menuPage, bindMenuPage } from '../../src/features/menu/menu-page.js';
import { normalizeCatalog, filterCatalog } from '../../src/services/catalog.js';

test('home preserves approved hierarchy and never invents catalog or promotional data', () => {
  const html = homePage();
  const positions = ['store-header', 'home-hero', 'home-search', 'categories-title', 'popular-title', 'home-secondary', 'bottom-nav'].map((key) => html.indexOf(key));
  assert.ok(positions.every((p) => p >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.match(html, /Categories are on the way/);
  assert.match(html, /Popular dishes will appear here/);
  assert.doesNotMatch(html, /Rs\s*\d|\$\d|\b\d+%\s*off/i);
});

test('menu screen has search, category filters, two-column grid contract and honest empty state', () => {
  const html = menuPage();
  assert.match(html, /id="menu-query"/);
  assert.match(html, /data-category="all"/);
  assert.match(html, /class="food-grid"/);
  assert.match(html, /Menu coming soon/);
  assert.match(html, /bottom-nav/);
});

test('catalog normalization rejects malformed records and unsafe image protocols', () => {
  const result = normalizeCatalog([
    { id: 'ok', name: 'Burger', price: 450, imageUrl: 'https://cdn.example/burger.webp', available: true },
    { id: 'bad', name: 'Broken', price: 'not-money' },
    { id: 'xss', name: 'Unsafe', price: 20, imageUrl: 'javascript:alert(1)' }
  ], [{ id: 'main', name: 'Mains' }]);
  assert.equal(result.products.length, 2);
  assert.equal(result.products[1].imageUrl, '');
  assert.equal(result.categories[0].id, 'main');
});

test('catalog search and category filters return only available matching products', () => {
  const products = normalizeCatalog([
    { id: '1', name: 'Classic Burger', description: 'Beef and cheese', price: 500, categoryId: 'burgers' },
    { id: '2', name: 'Veggie Wrap', description: 'Fresh vegetables', price: 300, categoryId: 'wraps' },
    { id: '3', name: 'Chicken Burger', price: 450, categoryId: 'burgers', available: false }
  ]).products;
  assert.deepEqual(filterCatalog(products, { query: 'burger', categoryId: 'burgers' }).map(p => p.id), ['1']);
  assert.deepEqual(filterCatalog(products, { categoryId: 'wraps' }).map(p => p.id), ['2']);
});

import { productDetailsPage, normalizeProductOptions } from '../../src/features/products/product-details.js';
import { cartLineId } from '../../src/services/cart.js';

test('product details uses honest empty state when the catalog is not connected', () => {
  const html = productDetailsPage({ products: [], categories: [] }, 'missing');
  assert.match(html, /Menu coming soon/);
  assert.match(html, /Browse menu/);
  assert.doesNotMatch(html, /Rs\s*\d|\$\d/);
});

test('product details renders validated customization options, quantity and total controls', () => {
  const catalog = { products: [{ id:'meal-1', name:'Test Meal', description:'Test description', price:400, options:[{id:'size',name:'Choose size',required:true,options:[{id:'regular',name:'Regular',priceDelta:0},{id:'large',name:'Large',priceDelta:120}]},{id:'extras',name:'Extras',selection:'multiple',options:[{id:'cheese',name:'Cheese',priceDelta:50}]}] }], categories:[] };
  const html = productDetailsPage(catalog, 'meal-1');
  assert.match(html, /Test Meal/);
  assert.match(html, /Choose size/);
  assert.match(html, /Large/);
  assert.match(html, /data-step="1"/);
  assert.match(html, /id="product-total"/);
  assert.match(html, /Add to cart/);
  assert.equal(normalizeProductOptions(catalog.products[0].options).length, 2);
});

test('cart line identity is stable across selection ordering and differs by customization', () => {
  const a = [{groupId:'size',optionId:'large'},{groupId:'extra',optionId:'cheese'}];
  const b = [...a].reverse();
  assert.equal(cartLineId('meal', a), cartLineId('meal', b));
  assert.notEqual(cartLineId('meal', a), cartLineId('meal', [{groupId:'size',optionId:'regular'}]));
});

import { cartPage } from '../../src/features/cart/cart-page.js';
import { normalizeCartLine, calculateCartTotals, formatPKR } from '../../src/services/cart.js';

const cartFixture = [
  { lineId:'meal::size=large', productId:'meal', name:'Test Meal', basePrice:400, unitPrice:520, quantity:2, selections:[{groupId:'size',groupName:'Size',optionId:'large',optionName:'Large',priceDelta:120}] },
  { lineId:'drink::', productId:'drink', name:'Test Drink', basePrice:100, unitPrice:100, quantity:1, selections:[] }
];

test('cart validates stored lines and rejects invalid prices or quantities', () => {
  assert.ok(normalizeCartLine(cartFixture[0]));
  assert.equal(normalizeCartLine({ ...cartFixture[0], quantity:0 }), null);
  assert.equal(normalizeCartLine({ ...cartFixture[0], unitPrice:-5 }), null);
  assert.equal(normalizeCartLine({ ...cartFixture[0], quantity:100 }), null);
});

test('cart subtotal uses integer paisa and includes customization price in each unit', () => {
  assert.deepEqual(calculateCartTotals(cartFixture), { itemCount:3, lineCount:2, subtotalPaisa:114000 });
  assert.equal(formatPKR(114000), 'Rs 1,140.00');
});

test('cart page displays item customizations, quantity controls and subtotal without fake checkout fees', () => {
  const html = cartPage(cartFixture);
  assert.match(html, /Test Meal/);
  assert.match(html, /Size: Large/);
  assert.match(html, /data-quantity=/);
  assert.match(html, /data-remove=/);
  assert.match(html, /Subtotal/);
  assert.match(html, /Rs 1,140\.00/);
  assert.match(html, /Delivery fee, taxes and any applicable charges are calculated at checkout/);
  assert.match(html, /href="#\/checkout">Continue to checkout/);
});

test('empty cart offers a clear route back to the menu', () => {
  const html = cartPage([]);
  assert.match(html, /Your cart is waiting/);
  assert.match(html, /href="#\/menu"/);
});

import { checkoutPage } from '../../src/features/checkout/checkout-page.js';

test('checkout renders delivery/pickup, matching cash methods, customer details and notes', () => {
  const html = checkoutPage(cartFixture);
  assert.match(html, /name="fulfillment" value="delivery"/);
  assert.match(html, /name="fulfillment" value="pickup"/);
  assert.match(html, /Cash on Delivery/);
  assert.match(html, /Cash on Pickup/);
  assert.match(html, /name="customerName"/);
  assert.match(html, /name="phone"/);
  assert.match(html, /name="address"/);
  assert.match(html, /name="notes"/);
  assert.match(html, /Rs 1,140\.00/);
});

test('checkout does not invent fees or claim order confirmation before backend verification', () => {
  const html = checkoutPage(cartFixture);
  assert.match(html, /Delivery fee/);
  assert.match(html, /To be confirmed/);
  assert.match(html, /Final total/);
  assert.match(html, /Not yet available/);
  assert.match(html, /disabled aria-disabled="true"/);
  assert.match(html, /does not place or reserve an order/);
  assert.doesNotMatch(html, /Order confirmed|Your order has been placed/i);
});

test('checkout empty state returns the customer to menu', () => {
  const html = checkoutPage([]);
  assert.match(html, /Your cart is empty/);
  assert.match(html, /href="#\/menu"/);
});
