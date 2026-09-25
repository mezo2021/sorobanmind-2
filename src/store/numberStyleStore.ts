// src/store/numberStyleStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NumberStyle = "arabic" | "latin";

export const NUMBER_STYLE_KEY = "soroban_number_style";
export const DEFAULT_NUMBER_STYLE: NumberStyle = "arabic";

interface NumberStyleState {
  style: NumberStyle;
  setStyle: (style: NumberStyle) => void;
  toggleStyle: () => void;
}

export const useNumberStyleStore = create<NumberStyleState>()(
  persist(
    (set) => ({
      style: DEFAULT_NUMBER_STYLE,
      setStyle: (style) => set({ style }),
      toggleStyle: () =>
        set((state) => ({
          style: state.style === "arabic" ? "latin" : "arabic",
        })),
    }),
    { name: NUMBER_STYLE_KEY },
  ),
);

export default useNumberStyleStore;