export type CustomProductSlug =
  | "tshirt"
  | "hoodie"
  | "sweater"
  | "glasscup"
  | "hat"
  | "apron"
  | "totebag";

export type CustomProduct = {
  slug: CustomProductSlug;
  name: string;
  tagline: string;
  imageUrl: string;
  sizes: string[];
  supportsMaterial: boolean;
};

const wearableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const utilitySizes = ["Small", "Medium", "Large"];

export const customProducts: CustomProduct[] = [
  {
    slug: "tshirt",
    name: "T-shirt",
    tagline: "Custom stamp design on demand",
    imageUrl: "https://placehold.co/800x800/f8f5ef/1d1d1d?text=Stampable+T-shirt",
    sizes: wearableSizes,
    supportsMaterial: true,
  },
  {
    slug: "hoodie",
    name: "Hoodie",
    tagline: "Street-ready stamp graphics",
    imageUrl: "https://placehold.co/800x800/ebe7df/1d1d1d?text=Stampable+Hoodie",
    sizes: wearableSizes,
    supportsMaterial: true,
  },
  {
    slug: "sweater",
    name: "Sweater",
    tagline: "Soft layers with bold stamped art",
    imageUrl: "https://placehold.co/800x800/e9efe8/1d1d1d?text=Stampable+Sweater",
    sizes: wearableSizes,
    supportsMaterial: true,
  },
  {
    slug: "glasscup",
    name: "Glass cup",
    tagline: "Stamped details for everyday sipping",
    imageUrl: "https://placehold.co/800x800/f1f4f6/1d1d1d?text=Stampable+Glass+Cup",
    sizes: utilitySizes,
    supportsMaterial: false,
  },
  {
    slug: "hat",
    name: "Hat",
    tagline: "Clean stamped mark up front",
    imageUrl: "https://placehold.co/800x800/f5efe6/1d1d1d?text=Stampable+Hat",
    sizes: wearableSizes,
    supportsMaterial: false,
  },
  {
    slug: "apron",
    name: "Apron",
    tagline: "Kitchen-ready with a custom stamp",
    imageUrl: "https://placehold.co/800x800/f0ebe3/1d1d1d?text=Stampable+Apron",
    sizes: utilitySizes,
    supportsMaterial: false,
  },
  {
    slug: "totebag",
    name: "Tote bag",
    tagline: "Carry-all style with stamped identity",
    imageUrl: "https://placehold.co/800x800/eee9de/1d1d1d?text=Stampable+Tote+Bag",
    sizes: utilitySizes,
    supportsMaterial: false,
  },
];

export const customProductMap = Object.fromEntries(
  customProducts.map((product) => [product.slug, product])
) as Record<CustomProductSlug, CustomProduct>;
