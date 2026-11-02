import test from 'node:test';
import assert from 'node:assert/strict';
import { demoProducts, demoCategories, DEMO_MODE } from '../../src/data/demo-catalog.js';
import { homePage } from '../../src/features/home/home-page.js';
import { menuPage } from '../../src/features/menu/menu-page.js';
import { productDetailsPage } from '../../src/features/products/product-details.js';
import { ordersPage, trackingPage } from '../../src/features/orders/order-pages.js';
import { adminPage, adminMenuPage } from '../../src/features/admin/admin-pages.js';

test('demo catalog is explicitly local demo content with coherent category references',()=>{
 assert.equal(DEMO_MODE,true); assert.ok(demoProducts.length>=4); assert.ok(demoCategories.length>=3);
 for(const p of demoProducts){assert.ok(demoCategories.some(c=>c.id===p.categoryId));assert.ok(Number.isFinite(p.price)&&p.price>0);}
});
test('demo home and menu render fixture products and categories',()=>{
 const source={products:demoProducts,categories:demoCategories};
 assert.match(homePage(source),/Double Smash Burger/); assert.match(homePage(source),/Categories/);
 assert.match(menuPage(source),/Pepperoni Pizza/); assert.match(menuPage(source),/data-category="burgers"/);
});
test('demo product details resolves real fixture id and customization options',()=>{
 const html=productDetailsPage({products:demoProducts,categories:demoCategories},'demo-smash');
 assert.match(html,/Double Smash Burger/);assert.match(html,/Extra toppings/);assert.match(html,/Add to cart/);
});
test('orders and tracking are honest and do not fabricate an order or ETA',()=>{
 assert.match(ordersPage(),/No real orders yet/);assert.match(trackingPage(),/Tracking isn't connected yet/);
 assert.doesNotMatch(trackingPage(),/Arriving in \d|Out for delivery|Order confirmed/i);
});
test('admin screens clearly label local demo and expose safe catalog actions',()=>{
 assert.match(adminPage(),/DEMO ADMIN/);const html=adminMenuPage();
 assert.match(html,/LOCAL DEMO DATA/);assert.match(html,/demo-product-form/);assert.match(html,/reset-demo-menu/);assert.match(html,/data-delete-product/);
});
