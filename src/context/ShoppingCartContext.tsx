import { createContext, useContext, useState, type ReactNode } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

export type CartItemCustomization = {
  productType: string;
  color?: string;
  size?: string;
  material?: string;
  design: {
    id: string;
    label: string;
    sourceType: "preset" | "upload";
    imageUrl: string;
  };
  transform: {
    x: number;
    y: number;
    scale: number;
    rotationDeg: number;
  };
};

export type CartItem = {
  id: number;
  size: string;
  quantity: number;
  // TODO: when order is placed, backend should persist imageUrl to the order
  // record so the PNG can be retrieved for DTF gang sheet fulfillment.
  customization?: CartItemCustomization;
};

type ShoppingCartContext = {
  cartQuantity: number;
  cartItems: CartItem[];
  openCart: () => void;
  closeCart: () => void;
getItemQuantity: (id: number, size: string, customization?: CartItemCustomization) => number;
increaseCartQuantity: (id: number, size: string, customization?: CartItemCustomization) => void;
decreaseCartQuantity: (id: number, size: string, customization?: CartItemCustomization) => void;
removeFromCart: (id: number, size: string, customization?: CartItemCustomization) => void;
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

function getCustomizationKey(customization?: CartItemCustomization) {
  return customization ? JSON.stringify(customization) : "base-item";
}

function isMatchingCartItem(item: CartItem, id: number, size: string, customization?: CartItemCustomization) {
  return (
    item.id === id &&
    item.size === size &&
    getCustomizationKey(item.customization) === getCustomizationKey(customization)
  );
}

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

  function getItemQuantity(id: number, size: string, customization?: CartItemCustomization) {
    return cartItems.find(item => isMatchingCartItem(item, id, size, customization))?.quantity || 0;
  }

  function increaseCartQuantity(id: number, size: string, customization?: CartItemCustomization) {
  setCartItems(currItems => {
    const existing = currItems.find(
      item => isMatchingCartItem(item, id, size, customization)
    );

    if (!existing) {
      return [...currItems, { id, size, quantity: 1, customization }];
    }

    return currItems.map(item =>
      isMatchingCartItem(item, id, size, customization)
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  });
}

  function decreaseCartQuantity(id: number, size: string, customization?: CartItemCustomization) {
  setCartItems(currItems => {
    const existing = currItems.find(
      item => isMatchingCartItem(item, id, size, customization)
    );

    if (existing?.quantity === 1) {
      return currItems.filter(
        item => !isMatchingCartItem(item, id, size, customization)
      );
    }

    return currItems.map(item =>
      isMatchingCartItem(item, id, size, customization)
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
  });
}

  function removeFromCart(id: number, size: string, customization?: CartItemCustomization) {
  setCartItems(currItems =>
    currItems.filter(item => !isMatchingCartItem(item, id, size, customization))
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
