export interface TShirtTemplate {
  id: string;
  name: string;
  category: string;
  image: string;
  previewColors: string[];
  style: 'crew' | 'v-neck' | 'polo' | 'oversized' | 'fitted';
  gender: 'unisex' | 'men' | 'women';
  tags: string[];
}

export interface Fabric {
  id: string;
  name: string;
  composition: string;
  weight: string;
  feel: string;
  careInstructions: string[];
  priceMultiplier: number;
  recommended: boolean;
  colors: FabricColor[];
}

export interface FabricColor {
  id: string;
  name: string;
  hex: string;
  available: boolean;
}

export interface Design {
  id: string;
  type: 'upload' | 'ai-generated' | 'template';
  imageUrl: string;
  prompt?: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

export interface CustomizationState {
  selectedTemplate: TShirtTemplate | null;
  selectedFabric: Fabric | null;
  selectedColor: FabricColor | null;
  design: Design | null;
  size: string;
  quantity: number;
}

export interface CartItem {
  id: string;
  customization: CustomizationState;
  price: number;
  createdAt: Date;
}

export interface AIRecommendation {
  type: 'color' | 'design' | 'fabric' | 'template';
  suggestion: string;
  reasoning: string;
  confidence: number;
}

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
