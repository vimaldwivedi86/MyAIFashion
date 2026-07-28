import { create } from 'zustand';
import type { CustomizationState, CartItem, TShirtTemplate, Fabric, FabricColor, Design } from '../types';

interface AppState {
  customization: CustomizationState;
  cart: CartItem[];
  isCartOpen: boolean;
  aiLoading: boolean;
  aiRecommendation: string;

  setTemplate: (t: TShirtTemplate) => void;
  setFabric: (f: Fabric) => void;
  setColor: (c: FabricColor) => void;
  setDesign: (d: Design | null) => void;
  setSize: (s: string) => void;
  setQuantity: (q: number) => void;
  addToCart: (price: number) => void;
  removeFromCart: (id: string) => void;
  toggleCart: () => void;
  setAiLoading: (v: boolean) => void;
  setAiRecommendation: (r: string) => void;
  resetCustomization: () => void;
}

const defaultCustomization: CustomizationState = {
  selectedTemplate: null,
  selectedFabric: null,
  selectedColor: null,
  design: null,
  size: 'M',
  quantity: 1,
};

export const useStore = create<AppState>((set, get) => ({
  customization: defaultCustomization,
  cart: [],
  isCartOpen: false,
  aiLoading: false,
  aiRecommendation: '',

  setTemplate: (t) => set((s) => ({ customization: { ...s.customization, selectedTemplate: t } })),
  setFabric: (f) => set((s) => ({ customization: { ...s.customization, selectedFabric: f, selectedColor: f.colors[0] } })),
  setColor: (c) => set((s) => ({ customization: { ...s.customization, selectedColor: c } })),
  setDesign: (d) => set((s) => ({ customization: { ...s.customization, design: d } })),
  setSize: (sz) => set((s) => ({ customization: { ...s.customization, size: sz } })),
  setQuantity: (q) => set((s) => ({ customization: { ...s.customization, quantity: q } })),

  addToCart: (price) => {
    const { customization } = get();
    const item: CartItem = {
      id: crypto.randomUUID(),
      customization: { ...customization },
      price,
      createdAt: new Date(),
    };
    set((s) => ({ cart: [...s.cart, item], isCartOpen: true }));
  },

  removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((i) => i.id !== id) })),

  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),

  setAiLoading: (v) => set({ aiLoading: v }),
  setAiRecommendation: (r) => set({ aiRecommendation: r }),

  resetCustomization: () => set({ customization: defaultCustomization }),
}));
