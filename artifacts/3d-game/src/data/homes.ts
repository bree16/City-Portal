export interface HomeOption {
  id: number;
  name: string;
  neighborhood: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  monthlyPayment: number;
  schools: number;
  walkability: number;
  commute: number;
  color: string;
}

export const homes: HomeOption[] = [
  { id: 1, name: "Hilton Village Colonial", neighborhood: "Hilton Village", price: 245000, beds: 3, baths: 2, sqft: 1480, monthlyPayment: 1348, schools: 4.2, walkability: 72, commute: 18, color: "#8B7355" },
  { id: 2, name: "Denbigh Ranch Home", neighborhood: "Denbigh", price: 198000, beds: 3, baths: 1, sqft: 1200, monthlyPayment: 1089, schools: 3.8, walkability: 58, commute: 24, color: "#6B8E8B" },
  { id: 3, name: "Oyster Point Townhouse", neighborhood: "Oyster Point", price: 289000, beds: 3, baths: 2.5, sqft: 1750, monthlyPayment: 1590, schools: 4.5, walkability: 81, commute: 12, color: "#8B6B6B" },
  { id: 4, name: "Southeast Starter Home", neighborhood: "Southeast", price: 168000, beds: 2, baths: 1, sqft: 980, monthlyPayment: 924, schools: 3.5, walkability: 45, commute: 30, color: "#7B8B6B" }
];
