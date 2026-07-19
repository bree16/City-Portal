export interface FurnitureItem {
  id: string;
  name: string;
  room: "Living Room" | "Bedroom" | "Kitchen" | "Office" | "Outdoor";
  emoji: string;
  price: number;
  style: "Modern" | "Farmhouse" | "Coastal";
  quality: 1 | 2 | 3;
}

export const furnitureItems: FurnitureItem[] = [
  { id: 'f1', name: 'Sectional Sofa', room: 'Living Room', emoji: '🛋️', price: 1200, style: 'Modern', quality: 3 },
  { id: 'f2', name: 'Coffee Table', room: 'Living Room', emoji: '☕', price: 450, style: 'Modern', quality: 2 },
  { id: 'f3', name: 'Queen Bed', room: 'Bedroom', emoji: '🛏️', price: 800, style: 'Modern', quality: 2 },
  { id: 'f4', name: 'Dining Table', room: 'Kitchen', emoji: '🍽️', price: 650, style: 'Farmhouse', quality: 2 },
  { id: 'f5', name: 'Desk', room: 'Office', emoji: '💻', price: 380, style: 'Modern', quality: 2 },
  { id: 'f6', name: 'Outdoor Loveseat', room: 'Outdoor', emoji: '🪑', price: 520, style: 'Coastal', quality: 2 },
  { id: 'f7', name: 'Bookshelf', room: 'Living Room', emoji: '📚', price: 290, style: 'Modern', quality: 1 },
  { id: 'f8', name: 'Floor Lamp', room: 'Living Room', emoji: '💡', price: 180, style: 'Coastal', quality: 1 },
  { id: 'f9', name: 'Kitchen Island', room: 'Kitchen', emoji: '🍳', price: 950, style: 'Farmhouse', quality: 3 },
  { id: 'f10', name: 'Accent Chair', room: 'Living Room', emoji: '🪑', price: 420, style: 'Coastal', quality: 2 },
  { id: 'f11', name: 'Nightstand', room: 'Bedroom', emoji: '🗄️', price: 220, style: 'Modern', quality: 1 },
  { id: 'f12', name: 'Dresser', room: 'Bedroom', emoji: '🗄️', price: 600, style: 'Farmhouse', quality: 2 },
  { id: 'f13', name: 'Bar Stools', room: 'Kitchen', emoji: '🪑', price: 300, style: 'Modern', quality: 1 },
  { id: 'f14', name: 'Ergonomic Chair', room: 'Office', emoji: '💺', price: 450, style: 'Modern', quality: 3 },
  { id: 'f15', name: 'Potted Plant', room: 'Living Room', emoji: '🪴', price: 80, style: 'Coastal', quality: 1 },
  { id: 'f16', name: 'Fire Pit', room: 'Outdoor', emoji: '🔥', price: 350, style: 'Coastal', quality: 2 },
  { id: 'f17', name: 'Hammock', room: 'Outdoor', emoji: '🏕️', price: 150, style: 'Coastal', quality: 1 },
  { id: 'f18', name: 'Microwave', room: 'Kitchen', emoji: '🎛️', price: 200, style: 'Modern', quality: 1 },
  { id: 'f19', name: 'Filing Cabinet', room: 'Office', emoji: '🗄️', price: 180, style: 'Farmhouse', quality: 1 },
  { id: 'f20', name: 'TV Stand', room: 'Living Room', emoji: '📺', price: 400, style: 'Modern', quality: 2 }
];
