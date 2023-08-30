import React, {
  createContext,
  MouseEvent,
  MutableRefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

interface CardData {
  id: string;
  top: number;
  left: number;
  text: string;
}

interface CanvasContextData {
  cards: CardData[];
  setCards: React.Dispatch<React.SetStateAction<CardData[]>>;
  canvasRef: MutableRefObject<HTMLDivElement | null>;
}

const CanvasContext = createContext<CanvasContextData | null>(null);

export const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const providedValue = useMemo(
    () => ({
      cards,
      setCards,
      canvasRef,
    }),
    [cards],
  );

  return <CanvasContext.Provider value={providedValue}>{children}</CanvasContext.Provider>;
};

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);

  if (!context) {
    throw new Error('Can not `useCanvasContext` outside of the `CanvasProvider` ');
  }

  const { cards, setCards, ...rest } = context;

  // const onMouseMove = useCallback((e: Event) => {
  // 	h
  // } , []);
  //
  // useEffect(() => {
  //
  //
  // 	const canvasElem = canvasRef.current;
  //
  // 	canvasElem?.addEventListener("mousemove", onMouseMove);
  // 	return () => {
  // 		canvasElem?.removeEventListener("mousemove", onMouseMove);
  // 	};
  // }, []);

  const onChangeCardPosition = useCallback((cardId: string, left: number, top: number) => {
    setCards((prev) =>
      prev.map((item) =>
        item.id === cardId
          ? {
              ...item,
              left,
              top,
            }
          : item,
      ),
    );
  }, []);

  const onChangeCardText = useCallback((cardId: string, value: string) => {
    setCards((prev) =>
      prev.map((item) =>
        item.id === cardId
          ? {
              ...item,
              text: value,
            }
          : item,
      ),
    );
  }, []);

  const createCard = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCards((prev) => [
      ...prev,
      {
        id: uuidv4(),
        top: y,
        left: x,
        text: '',
      },
    ]);
  };

  return {
    cards,
    setCards,
    createCard,
    onChangeCardText,
    onChangeCardPosition,
    ...rest,
  };
};
