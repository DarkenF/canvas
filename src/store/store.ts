import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface CardData {
  id: string;
  top: number;
  left: number;
  text: string;
}

interface CardsStore {
  cards: CardData[];
  changeCardPosition: (cardId: string, offsetLeft: number, offsetTop: number) => void;
  changeCardText: (cardId: string, value: string) => void;
  createCard: (x: number, y: number) => void;
}

export const useCardsStore = create<CardsStore>((set, get) => ({
  cards: [],
  changeCardPosition: (cardId: string, offsetLeft: number, offsetTop: number) =>
    set((state) => ({
      cards: state.cards.map((item) =>
        item.id === cardId
          ? {
              ...item,
              left: item.left + offsetLeft,
              top: item.top + offsetTop,
            }
          : item,
      ),
    })),
  changeCardText: (cardId: string, value: string) =>
    set((state) => ({
      cards: state.cards.map((item) =>
        item.id === cardId
          ? {
              ...item,
              text: value,
            }
          : item,
      ),
    })),
  createCard: (x: number, y: number) =>
    set({
      cards: [
        ...get().cards,
        {
          id: uuidv4(),
          top: y,
          left: x,
          text: '',
        },
      ],
    }),
}));
