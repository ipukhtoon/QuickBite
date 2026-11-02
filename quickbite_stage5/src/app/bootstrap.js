import { currentRoute, navigate, onRouteChange } from './router.js';
import { welcomePage } from '../features/onboarding/welcome.js';
import { signInPage, createAccountPage, bindAuthPage } from '../features/authentication/auth-pages.js';
import { homePage, bindHomePage } from '../features/home/home-page.js';
import { menuPage, bindMenuPage } from '../features/menu/menu-page.js';
import { productDetailsPage, bindProductDetails } from '../features/products/product-details.js';
import { loadCartPage } from '../features/cart/cart-page.js';
import { loadCheckoutPage } from '../features/checkout/checkout-page.js';
import { getDemoCatalog } from '../services/demo-data.js';
import { ordersPage, trackingPage } from '../features/orders/order-pages.js';
import { adminPage, adminMenuPage, bindAdminMenu } from '../features/admin/admin-pages.js';

const app=document.querySelector('#app');
function render(){
 const route=currentRoute(); const catalog=getDemoCatalog();
 if(route==='/') app.innerHTML=welcomePage();
 else if(route==='/sign-in') app.innerHTML=signInPage();
 else if(route==='/create-account') app.innerHTML=createAccountPage();
 else if(route==='/home') app.innerHTML=homePage(catalog);
 else if(route==='/menu') app.innerHTML=menuPage(catalog);
 else if(route==='/product'){const id=new URLSearchParams(window.location.hash.split('?')[1]??'').get('id')??'';app.innerHTML=productDetailsPage(catalog,id);bindProductDetails(catalog,id);}
 else if(route==='/cart') loadCartPage();
 else if(route==='/checkout') loadCheckoutPage();
 else if(route==='/orders') app.innerHTML=ordersPage();
 else if(route==='/tracking') app.innerHTML=trackingPage();
 else if(route==='/admin') app.innerHTML=adminPage();
 else if(route==='/admin/menu'){app.innerHTML=adminMenuPage();bindAdminMenu();}
 bindAuthPage(route);
 if(route==='/home')bindHomePage();
 if(route==='/menu')bindMenuPage(catalog);
 if(['/home','/menu','/product','/cart','/checkout','/orders','/tracking','/admin','/admin/menu'].includes(route)){
   const banner=document.createElement('div');banner.className='demo-ribbon';banner.setAttribute('role','note');banner.innerHTML='<b>UI DEMO</b><span>Sample menu & local-only data · No real orders or payments</span>';
   app.prepend(banner);
 }
 const main=app.querySelector('main');if(main){main.setAttribute('tabindex','-1');if(window.location.hash)main.focus({preventScroll:true});}
}
export function bootstrap(){if(!app)throw new Error('QuickBite root element #app was not found.');render();onRouteChange(render);document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#/"]');if(!link)return;const target=link.getAttribute('href').slice(1);if(target===window.location.hash){event.preventDefault();navigate(target);render();}});}
