import { demoProducts, demoCategories } from '../data/demo-catalog.js';
const KEY='quickbite-ui-demo-catalog-v1';
export function getDemoCatalog(){
  try { const saved=localStorage.getItem(KEY); if(saved){const v=JSON.parse(saved); if(Array.isArray(v.products)&&Array.isArray(v.categories)) return v;} } catch {}
  return {products:structuredClone(demoProducts),categories:structuredClone(demoCategories)};
}
export function saveDemoCatalog(value){ localStorage.setItem(KEY,JSON.stringify(value)); }
export function resetDemoCatalog(){ localStorage.removeItem(KEY); return getDemoCatalog(); }
