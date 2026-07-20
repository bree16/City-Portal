import { GameIconName } from '@/components/ui/GameIcon';

export interface FurnitureItem {
  id: string;
  name: string;
  room: "Living Room" | "Bedroom" | "Kitchen" | "Office" | "Outdoor";
  icon: GameIconName;
  price: number;
  style: "Modern" | "Farmhouse" | "Coastal";
  quality: 1 | 2 | 3;
}

export const furnitureItems: FurnitureItem[] = [
  { id: 'f1', name: 'Sectional Sofa', room: 'Living Room', icon: 'sofa', price: 1200, style: 'Modern', quality: 3 },
  { id: 'f2', name: 'Coffee Table', room: 'Living Room', icon: 'coffee', price: 450, style: 'Modern', quality: 2 },
  { id: 'f3', name: 'Queen Bed', room: 'Bedroom', icon: 'bed', price: 800, style: 'Modern', quality: 2 },
  { id: 'f4', name: 'Dining Table', room: 'Kitchen', icon: 'dining', price: 650, style: 'Farmhouse', quality: 2 },
  { id: 'f5', name: 'Desk', room: 'Office', icon: 'laptop', price: 380, style: 'Modern', quality: 2 },
  { id: 'f6', name: 'Outdoor Loveseat', room: 'Outdoor', icon: 'chair', price: 520, style: 'Coastal', quality: 2 },
  { id: 'f7', name: 'Bookshelf', room: 'Living Room', icon: 'book', price: 290, style: 'Modern', quality: 1 },
  { id: 'f8', name: 'Floor Lamp', room: 'Living Room', icon: 'lightbulb', price: 180, style: 'Coastal', quality: 1 },
  { id: 'f9', name: 'Kitchen Island', room: 'Kitchen', icon: 'kitchen', price: 950, style: 'Farmhouse', quality: 3 },
  { id: 'f10', name: 'Accent Chair', room: 'Living Room', icon: 'chair', price: 420, style: 'Coastal', quality: 2 },
  { id: 'f11', name: 'Nightstand', room: 'Bedroom', icon: 'cabinet', price: 220, style: 'Modern', quality: 1 },
  { id: 'f12', name: 'Dresser', room: 'Bedroom', icon: 'cabinet', price: 600, style: 'Farmhouse', quality: 2 },
  { id: 'f13', name: 'Bar Stools', room: 'Kitchen', icon: 'chair', price: 300, style: 'Modern', quality: 1 },
  { id: 'f14', name: 'Ergonomic Chair', room: 'Office', icon: 'office-chair', price: 450, style: 'Modern', quality: 3 },
  { id: 'f15', name: 'Potted Plant', room: 'Living Room', icon: 'plant', price: 80, style: 'Coastal', quality: 1 },
  { id: 'f16', name: 'Fire Pit', room: 'Outdoor', icon: 'fire', price: 350, style: 'Coastal', quality: 2 },
  { id: 'f17', name: 'Hammock', room: 'Outdoor', icon: 'tent', price: 150, style: 'Coastal', quality: 1 },
  { id: 'f18', name: 'Microwave', room: 'Kitchen', icon: 'microwave', price: 200, style: 'Modern', quality: 1 },
  { id: 'f19', name: 'Filing Cabinet', room: 'Office', icon: 'cabinet', price: 180, style: 'Farmhouse', quality: 1 },
  { id: 'f20', name: 'TV Stand', room: 'Living Room', icon: 'tv', price: 400, style: 'Modern', quality: 2 }
];
