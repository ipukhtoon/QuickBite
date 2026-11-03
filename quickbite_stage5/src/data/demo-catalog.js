/** Local-only demonstration catalog. Never used by Firebase or production services. */
export const DEMO_MODE = true;
export const demoCategories = [
  { id:'burgers', name:'Burgers' }, { id:'pizza', name:'Pizza' }, { id:'sides', name:'Sides' }, { id:'drinks', name:'Drinks' }
];
export const demoProducts = [
  { id:'demo-smash', name:'Double Smash Burger', description:'Two seared beef patties, cheddar, pickles and house sauce.', price:690, categoryId:'burgers', featured:true, imageUrl:'/images/classic-burger.webp', options:[{id:'size',name:'Make it a meal',required:false,selection:'single',options:[{id:'solo',name:'Burger only',priceDelta:0},{id:'meal',name:'Add fries & drink',priceDelta:220}]},{id:'extras',name:'Extra toppings',required:false,selection:'multiple',options:[{id:'cheese',name:'Extra cheese',priceDelta:70},{id:'jalapeno',name:'Jalapeños',priceDelta:40}]}] },
  { id:'demo-chicken', name:'Crispy Chicken Burger', description:'Golden crispy chicken, lettuce and creamy pepper mayo.', price:590, categoryId:'burgers', featured:true, imageUrl:'/images/chicken-burger.webp', options:[] },
  { id:'demo-pizza', name:'Pepperoni Pizza', description:'Stone-baked pizza with mozzarella and pepperoni.', price:1190, categoryId:'pizza', featured:true, imageUrl:'/images/pizza.webp', options:[{id:'size',name:'Choose size',required:true,selection:'single',options:[{id:'regular',name:'Regular',priceDelta:0},{id:'large',name:'Large',priceDelta:450}]}] },
  { id:'demo-fries', name:'Loaded Fries', description:'Crispy fries topped with cheese sauce and herbs.', price:390, categoryId:'sides', featured:true, imageUrl:'/images/fries.webp', options:[] },
  { id:'demo-drink', name:'Chilled Lemonade', description:'Fresh-tasting citrus cooler served ice cold.', price:220, categoryId:'drinks', featured:false, imageUrl:'/images/drinks.webp', options:[] }
];
