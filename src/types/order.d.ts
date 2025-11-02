export type ArticleShape = "Rechteck" | "Zylinder" | "";

export type Article = {
  name: string;
  amount: number;
  weight: number; // kg per unit
  shape: ArticleShape;
  // rectangle
  height?: number; // cm
  length?: number; // cm
  width?: number; // cm
  // cylinder
  diameter?: number; // cm
  // pallet
  usesPallet: boolean;
  palletHeight?: number;
  palletLength?: number;
  palletWidth?: number;
};
