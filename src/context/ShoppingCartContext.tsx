import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";
import storeItems from "../data/items.json";
import { customProductMap } from "../data/customProducts";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

export type CartItemCustomization = {
  productType: string;
  color?: string;
  size?: string;
  genderFit?: string;
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
  sides?: {
    front: {
      designId: string;
      designLabel: string;
      sourceType: "preset" | "upload";
      designUrl: string;
      transform: {
        x: number;
        y: number;
        scale: number;
        rotationDeg: number;
      };
    };
    back: {
      designId: string;
      designLabel: string;
      sourceType: "preset" | "upload";
      designUrl: string;
      transform: {
        x: number;
        y: number;
        scale: number;
        rotationDeg: number;
      };
    };
  };
};

export type CartItem = {
  id: number;
  size: string;
  quantity: number;
  price?: number;
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
  increaseCartQuantity: (
    id: number,
    size: string,
    customization?: CartItemCustomization,
    price?: number
  ) => void;
  decreaseCartQuantity: (id: number, size: string, customization?: CartItemCustomization) => void;
  removeFromCart: (id: number, size: string, customization?: CartItemCustomization) => void;
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);
// Increment this version string any time the cart item schema
// changes (new required fields, price structure changes, etc.)
// to avoid stale localStorage data causing checkout errors.
const CART_STORAGE_KEY = "shopping-cart-v2";

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
  const [rawCartItems, setCartItems] = useLocalStorage<CartItem[]>(CART_STORAGE_KEY, []);
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useMemo(
    () =>
      rawCartItems.filter((item) => {
        const isStoreItem = storeItems.some((product) => product.id === item.id);
        const isCustomItem = item.customization?.productType
          ? Object.keys(customProductMap).includes(item.customization.productType)
          : false;
        return isStoreItem || isCustomItem;
      }),
    [rawCartItems]
  );

  useEffect(() => {
    if (cartItems.length !== rawCartItems.length) {
      setCartItems(cartItems);
    }
  }, [cartItems, rawCartItems.length, setCartItems]);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  function getItemQuantity(id: number, size: string, customization?: CartItemCustomization) {
    return cartItems.find(item => isMatchingCartItem(item, id, size, customization))?.quantity || 0;
  }

  function increaseCartQuantity(
    id: number,
    size: string,
    customization?: CartItemCustomization,
    price?: number
  ) {
  setCartItems(currItems => {
    const existing = currItems.find(
      item => isMatchingCartItem(item, id, size, customization)
    );

    if (!existing) {
      return [...currItems, { id, size, quantity: 1, customization, price }];
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
