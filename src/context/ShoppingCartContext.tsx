import { createContext, useContext, useState, type ReactNode } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  size: string;
  quantity: number;
};

type ShoppingCartContext = {
  cartQuantity: number;
  cartItems: CartItem[];
  openCart: () => void;
  closeCart: () => void;
getItemQuantity: (id: number, size: string) => number;
increaseCartQuantity: (id: number, size: string) => void;
decreaseCartQuantity: (id: number, size: string) => void;
removeFromCart: (id: number, size: string) => void;
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart",[]);
  const [isOpen, setIsOpen] = useState(false);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  function getItemQuantity(id: number, size: string) {
    return cartItems.find(item => item.id === id && item.size === size)?.quantity || 0;
  }

  function increaseCartQuantity(id: number, size: string) {
  setCartItems(currItems => {
    const existing = currItems.find(
      item => item.id === id && item.size === size
    );

    if (!existing) {
      return [...currItems, { id, size, quantity: 1 }];
    }

    return currItems.map(item =>
      item.id === id && item.size === size
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  });
}

  function decreaseCartQuantity(id: number, size: string) {
  setCartItems(currItems => {
    const existing = currItems.find(
      item => item.id === id && item.size === size
    );

    if (existing?.quantity === 1) {
      return currItems.filter(
        item => !(item.id === id && item.size === size)
      );
    }

    return currItems.map(item =>
      item.id === id && item.size === size
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
  });
}

  function removeFromCart(id: number, size: string) {
  setCartItems(currItems =>
    currItems.filter(item => !(item.id === id && item.size === size))
  );
}

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen}/>
    </ShoppingCartContext.Provider>
  );
}
