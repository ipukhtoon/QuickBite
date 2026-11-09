export const DEMO_PRODUCT_OPTIONS = {
  'demo-burger': [
    { id: 'size', name: 'Size', type: 'single', required: true, min: 1, max: 1, choices: [{ id: 'classic', label: 'Classic', deltaMinor: 0 }, { id: 'double', label: 'Double patty', deltaMinor: 250 }] },
    { id: 'extras', name: 'Extras', type: 'multiple', required: false, min: 0, max: 2, choices: [{ id: 'cheese', label: 'Extra cheese', deltaMinor: 100 }, { id: 'bacon', label: 'Beef bacon', deltaMinor: 150 }] },
  ],
  'demo-pizza': [
    { id: 'size', name: 'Pizza size', type: 'single', required: true, min: 1, max: 1, choices: [{ id: 'small', label: 'Small', deltaMinor: 0 }, { id: 'medium', label: 'Medium', deltaMinor: 300 }, { id: 'large', label: 'Large', deltaMinor: 500 }] },
    { id: 'crust', name: 'Crust', type: 'single', required: true, min: 1, max: 1, choices: [{ id: 'classic', label: 'Classic', deltaMinor: 0 }, { id: 'thin', label: 'Thin', deltaMinor: 0 }, { id: 'stuffed', label: 'Stuffed crust', deltaMinor: 200 }] },
  ],
  'demo-sushi': [
    { id: 'portion', name: 'Portion', type: 'single', required: true, min: 1, max: 1, choices: [{ id: 'six', label: '6 pieces', deltaMinor: 0 }, { id: 'twelve', label: '12 pieces', deltaMinor: 500 }] },
  ],
  'demo-taco': [
    { id: 'heat', name: 'Spice level', type: 'single', required: true, min: 1, max: 1, choices: [{ id: 'mild', label: 'Mild', deltaMinor: 0 }, { id: 'medium', label: 'Medium', deltaMinor: 0 }, { id: 'hot', label: 'Hot', deltaMinor: 0 }] },
    { id: 'extras', name: 'Extras', type: 'multiple', required: false, min: 0, max: 2, choices: [{ id: 'guacamole', label: 'Guacamole', deltaMinor: 150 }, { id: 'salsa', label: 'Extra salsa', deltaMinor: 50 }] },
  ],
};
