export type CustomProductSlug =
  | "tshirt"
  | "hoodie"
  | "sweater"
  | "glasscup"
  | "hat"
  | "apron"
  | "totebag";

export type CustomProduct = {
  id: number;
  slug: CustomProductSlug;
  name: string;
  tagline: string;
  price: number;
  imageUrl: string;
  sizes: string[];
  supportsMaterial: boolean;
};

const wearableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const utilitySizes = ["Small", "Medium", "Large"];

export const customProducts: CustomProduct[] = [
  {
    id: 101,
    slug: "tshirt",
    name: "T-shirt",
    tagline: "Custom stamp design on demand",
    price: 17,
    imageUrl: "https://placehold.co/800x800/f8f5ef/1d1d1d?text=Stampable+T-shirt",
    sizes: wearableSizes,
    supportsMaterial: true,
  },
  {
    id: 102,
    slug: "hoodie",
    name: "Hoodie",
    tagline: "Street-ready stamp graphics",
    price: 28,
    imageUrl: "https://placehold.co/800x800/ebe7df/1d1d1d?text=Stampable+Hoodie",
    sizes: wearableSizes,
    supportsMaterial: true,
  },
  {
    id: 103,
    slug: "sweater",
    name: "Sweater",
    tagline: "Soft layers with bold stamped art",
    price: 25,
    imageUrl: "https://placehold.co/800x800/e9efe8/1d1d1d?text=Stampable+Sweater",
    sizes: wearableSizes,
    supportsMaterial: true,
  },
  {
    id: 104,
    slug: "glasscup",
    name: "Glass cup",
    tagline: "Stamped details for everyday sipping",
    price: 18,
    imageUrl: "https://placehold.co/800x800/f1f4f6/1d1d1d?text=Stampable+Glass+Cup",
    sizes: utilitySizes,
    supportsMaterial: false,
  },
  {
    id: 105,
    slug: "hat",
    name: "Hat",
    tagline: "Clean stamped mark up front",
    price: 25,
    imageUrl: "https://placehold.co/800x800/f5efe6/1d1d1d?text=Stampable+Hat",
    sizes: wearableSizes,
    supportsMaterial: false,
  },
  {
    id: 106,
    slug: "apron",
    name: "Apron",
    tagline: "Kitchen-ready with a custom stamp",
    price: 18,
    imageUrl: "https://placehold.co/800x800/f0ebe3/1d1d1d?text=Stampable+Apron",
    sizes: utilitySizes,
    supportsMaterial: false,
  },
  {
    id: 107,
    slug: "totebag",
    name: "Tote bag",
    tagline: "Carry-all style with stamped identity",
    price: 15,
    imageUrl: "https://placehold.co/800x800/eee9de/1d1d1d?text=Stampable+Tote+Bag",
    sizes: utilitySizes,
    supportsMaterial: false,
  },
];

export const customProductMap = Object.fromEntries(
  customProducts.map((product) => [product.slug, product])
) as Record<CustomProductSlug, CustomProduct>;
