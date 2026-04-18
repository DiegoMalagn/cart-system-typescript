import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Badge, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import design1 from "../assets/designs/stampDesign1.png";
import design2 from "../assets/designs/stampDesign2.png";
import designBestDadEver from "../assets/designs/bestDadEverDesign.png";
import designFaith from "../assets/designs/faithDesign.png";
import designFaith2 from "../assets/designs/faithDesign2.png";
import designLove from "../assets/designs/loveDesign.png";
import tshirtBlackFront from "../assets/mockups/tshirts/tshirt-black-front.png";
import tshirtBlackBack from "../assets/mockups/tshirts/tshirt-black-back.png";
import tshirtWhiteFront from "../assets/mockups/tshirts/tshirt-white-front.png";
import tshirtWhiteBack from "../assets/mockups/tshirts/tshirt-white-back.png";
import tshirtSlateFront from "../assets/mockups/tshirts/tshirt-slate-front.png";
import tshirtSlateBack from "../assets/mockups/tshirts/tshirt-slate-back.png";
import tshirtOliveFront from "../assets/mockups/tshirts/tshirt-olive-front.png";
import tshirtOliveBack from "../assets/mockups/tshirts/tshirt-olive-back.png";
import tshirtBurgundyFront from "../assets/mockups/tshirts/tshirt-burgundy-front.png";
import tshirtBurgundyBack from "../assets/mockups/tshirts/tshirt-burgundy-back.png";
import tshirtLightGrayFront from "../assets/mockups/tshirts/tshirt-lightgray-front.png";
import tshirtLightGrayBack from "../assets/mockups/tshirts/tshirt-lightgray-back.png";
import tshirtSandFront from "../assets/mockups/tshirts/tshirt-sand-front.png";
import tshirtSandBack from "../assets/mockups/tshirts/tshirt-sand-back.png";
import tshirtRedFront from "../assets/mockups/tshirts/tshirt-red-front.png";
import tshirtRedBack from "../assets/mockups/tshirts/tshirt-red-back.png";
import hoodieBlackFront from "../assets/mockups/hoodies/hoodie-black-front.png";
import hoodieBlackBack from "../assets/mockups/hoodies/hoodie-black-back.png";
import hoodieWhiteFront from "../assets/mockups/hoodies/hoodie-white-front.png";
import hoodieWhiteBack from "../assets/mockups/hoodies/hoodie-white-back.png";
import hoodieSlateFront from "../assets/mockups/hoodies/hoodie-slate-front.png";
import hoodieSlateBack from "../assets/mockups/hoodies/hoodie-slate-black.png";
import hoodieOliveFront from "../assets/mockups/hoodies/hoodie-olive-front.png";
import hoodieOliveBack from "../assets/mockups/hoodies/hoodie-olive-back.png";
import hoodieBurgundyFront from "../assets/mockups/hoodies/hoodie-burgundy-front.png";
import hoodieBurgundyBack from "../assets/mockups/hoodies/hoodie-burgundy-back.png";
import hoodieLightGrayFront from "../assets/mockups/hoodies/hoodie-lightgray-front.png";
import hoodieLightGrayBack from "../assets/mockups/hoodies/hoodie-lightgray-back.png";
import hoodieSandFront from "../assets/mockups/hoodies/hoodie-sand-front.png";
import hoodieSandBack from "../assets/mockups/hoodies/hoodie-sand-back.png";
import hoodieRedFront from "../assets/mockups/hoodies/hoodie-red-front.png";
import hoodieRedBack from "../assets/mockups/hoodies/hoodie-red-back.png";
import sweatshirtBlackFront from "../assets/mockups/sweatshirts/sweatshirt-black-front.png";
import sweatshirtBlackBack from "../assets/mockups/sweatshirts/sweatshirt-black-back.png";
import sweatshirtWhiteFront from "../assets/mockups/sweatshirts/sweatshirt-white-front.png";
import sweatshirtWhiteBack from "../assets/mockups/sweatshirts/sweatshirt-white-back.png";
import sweatshirtSlateFront from "../assets/mockups/sweatshirts/sweatshirt-slate-front.png";
import sweatshirtSlateBack from "../assets/mockups/sweatshirts/sweatshirt-slate-back.png";
import sweatshirtOliveFront from "../assets/mockups/sweatshirts/sweatshirt-olive-front.png";
import sweatshirtOliveBack from "../assets/mockups/sweatshirts/sweatshirt-olive-back.png";
import sweatshirtBurgundyFront from "../assets/mockups/sweatshirts/sweatshirt-burgundy-front.png";
import sweatshirtBurgundyBack from "../assets/mockups/sweatshirts/sweatshirt-burgundy-back.png";
import sweatshirtLightGrayFront from "../assets/mockups/sweatshirts/sweatshirt-lightgray-front.png";
import sweatshirtLightGrayBack from "../assets/mockups/sweatshirts/sweatshirt-lightgray-back.png";
import sweatshirtSandFront from "../assets/mockups/sweatshirts/sweatshirt-sand-front.png";
import sweatshirtSandBack from "../assets/mockups/sweatshirts/sweatshirt-sand-back.png";
import sweatshirtRedFront from "../assets/mockups/sweatshirts/sweatshirt-red-front.png";
import sweatshirtRedBack from "../assets/mockups/sweatshirts/sweatshirt-red-back.png";
import glassCupImage from "../assets/mockups/glassCup/glasscup.png";
import hatImage from "../assets/mockups/hats/whitehat.png";
import apronImage from "../assets/mockups/aprons/whiteapron.png";
import totebagImage from "../assets/mockups/totebags/white-linen-apron.png";
import {
  type CartItemCustomization,
  useShoppingCart,
} from "../context/ShoppingCartContext";
import {
  customProductMap,
  type CustomProductSlug,
} from "../data/customProducts";

type ProductCustomizerProps = {
  productType: CustomProductSlug;
};

type DesignOption = {
  id: string;
  label: string;
  sourceType: "preset" | "upload";
  imageUrl: string;
  fulfillmentUrl?: string;
};

type MockupSide = "front" | "back";

type DesignTransform = {
  x: number;
  y: number;
  scale: number;
  rotationDeg: number;
};

type DesignSidesState = Record<MockupSide, string>;
type DesignTransformMap = Record<MockupSide, DesignTransform>;
type MockupImagePair = { front: string; back: string };
type DragMode =
  | "move"
  | "scale-tl"
  | "scale-tr"
  | "scale-br"
  | "scale-bl"
  | "rotate";

const colorOptions = [
  { label: "Near Black", value: "#221d19" },
  { label: "Slate Blue", value: "#3b525f" },
  { label: "Olive Brown", value: "#40382d" },
  { label: "Burgundy", value: "#6e222c" },
  { label: "Light Gray", value: "#e7ece7" },
  { label: "Sand", value: "#eec98a" },
  { label: "Red", value: "#ef000b" },
  { label: "White", value: "#ffffff" },
];

const AVAILABLE_DESIGNS: DesignOption[] = [
  { id: "design-1", label: "Design 1", sourceType: "preset", imageUrl: design1 },
  { id: "design-2", label: "Design 2", sourceType: "preset", imageUrl: design2 },
  {
    id: "design-bestdadever",
    label: "Best Dad Ever",
    sourceType: "preset",
    imageUrl: designBestDadEver,
  },
  {
    id: "design-faith",
    label: "Faith",
    sourceType: "preset",
    imageUrl: designFaith,
  },
  {
    id: "design-faith2",
    label: "Faith 2",
    sourceType: "preset",
    imageUrl: designFaith2,
  },
  {
    id: "design-love",
    label: "Love",
    sourceType: "preset",
    imageUrl: designLove,
  },
];

const AVAILABLE_MATERIALS = [
  { value: "cotton", label: "100% Cotton" },
  // future: { value: "blend", label: "Cotton-Polyester Blend" },
];

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];
// future: add XS, 4XL etc. here
const SIZE_PRICES: Record<string, number> = {
  S: 17.0,
  M: 17.0,
  L: 17.0,
  XL: 17.0,
  XXL: 20.0,
  XXXL: 22.0,
};

const AVAILABLE_GENDER_FITS = ["Unisex", "Men's", "Women's"];

const PRODUCT_OPTIONS_CONFIG: Record<
  CustomProductSlug,
  {
    showColor: boolean;
    showSize: boolean;
    showGenderFit: boolean;
    showMaterial: boolean;
  }
> = {
  tshirt: { showColor: true, showSize: true, showGenderFit: true, showMaterial: true },
  hoodie: { showColor: true, showSize: true, showGenderFit: true, showMaterial: true },
  sweater: { showColor: true, showSize: true, showGenderFit: true, showMaterial: true },
  glasscup: { showColor: false, showSize: false, showGenderFit: false, showMaterial: false },
  hat: { showColor: false, showSize: false, showGenderFit: false, showMaterial: false },
  apron: { showColor: false, showSize: false, showGenderFit: false, showMaterial: false },
  totebag: { showColor: false, showSize: false, showGenderFit: false, showMaterial: false },
};

// PNG asset dimensions: 1536 x 1024px at 72 DPI
// To convert a coordinate measured on the source PNG to canvas px:
//   canvasX = Math.round(pngX * PNG_SCALE) + IMG_OFFSET_X
//   canvasY = Math.round(pngY * PNG_SCALE) + IMG_OFFSET_Y
// To add a new placement zone, measure pngX/pngY in an image
// editor and apply the formula above.
const PNG_SCALE = 680 / 1536;
const IMG_H = Math.round(1024 * PNG_SCALE);
const IMG_OFFSET_Y = Math.round((480 - IMG_H) / 2);
const IMG_OFFSET_X = 0;
const CENTER_X = Math.round(765 * PNG_SCALE);
const CENTER_Y =
  Math.round(365 * PNG_SCALE) + IMG_OFFSET_Y;
const HANDLE_SIZE = 5;
const ROT_HANDLE_DIST = 20;
const ROT_HANDLE_RADIUS = 5;

const PLACEMENT_ZONES = {
  "chest-left": {
    x: Math.round(635 * PNG_SCALE) + IMG_OFFSET_X,
    y: Math.round(365 * PNG_SCALE) + IMG_OFFSET_Y,
  },
  "chest-center": {
    x: Math.round(765 * PNG_SCALE) + IMG_OFFSET_X,
    y: Math.round(365 * PNG_SCALE) + IMG_OFFSET_Y,
  },
  "chest-right": {
    x: Math.round(895 * PNG_SCALE) + IMG_OFFSET_X,
    y: Math.round(365 * PNG_SCALE) + IMG_OFFSET_Y,
  },
} as const;

const PLACEMENT_ZONES_BACK = {
  "chest-left": {
    x: Math.round(635 * PNG_SCALE) + IMG_OFFSET_X,
    y: Math.round(365 * PNG_SCALE) + IMG_OFFSET_Y,
  },
  "chest-center": {
    x: Math.round(765 * PNG_SCALE) + IMG_OFFSET_X,
    y: Math.round(365 * PNG_SCALE) + IMG_OFFSET_Y,
  },
  "chest-right": {
    x: Math.round(895 * PNG_SCALE) + IMG_OFFSET_X,
    y: Math.round(365 * PNG_SCALE) + IMG_OFFSET_Y,
  },
} as const;

const CANVAS_PX_PER_INCH = 72 * PNG_SCALE;

const TSHIRT_COLOR_IMAGES: Record<string, MockupImagePair> = {
  "#221d19": { front: tshirtBlackFront, back: tshirtBlackBack },
  "#3b525f": { front: tshirtSlateFront, back: tshirtSlateBack },
  "#40382d": { front: tshirtOliveFront, back: tshirtOliveBack },
  "#6e222c": { front: tshirtBurgundyFront, back: tshirtBurgundyBack },
  "#e7ece7": { front: tshirtLightGrayFront, back: tshirtLightGrayBack },
  "#eec98a": { front: tshirtSandFront, back: tshirtSandBack },
  "#ef000b": { front: tshirtRedFront, back: tshirtRedBack },
  "#ffffff": { front: tshirtWhiteFront, back: tshirtWhiteBack },
};

const HOODIE_COLOR_IMAGES: Record<string, MockupImagePair> = {
  "#221d19": { front: hoodieBlackFront, back: hoodieBlackBack },
  "#3b525f": { front: hoodieSlateFront, back: hoodieSlateBack || hoodieSlateFront },
  "#40382d": { front: hoodieOliveFront, back: hoodieOliveBack },
  "#6e222c": { front: hoodieBurgundyFront, back: hoodieBurgundyBack },
  "#e7ece7": { front: hoodieLightGrayFront, back: hoodieLightGrayBack },
  "#eec98a": { front: hoodieSandFront, back: hoodieSandBack },
  "#ef000b": { front: hoodieRedFront, back: hoodieRedBack },
  "#ffffff": { front: hoodieWhiteFront, back: hoodieWhiteBack },
};

const SWEATSHIRT_COLOR_IMAGES: Record<string, MockupImagePair> = {
  "#221d19": { front: sweatshirtBlackFront, back: sweatshirtBlackBack },
  "#3b525f": { front: sweatshirtSlateFront, back: sweatshirtSlateBack },
  "#40382d": { front: sweatshirtOliveFront, back: sweatshirtOliveBack },
  "#6e222c": { front: sweatshirtBurgundyFront, back: sweatshirtBurgundyBack },
  "#e7ece7": { front: sweatshirtLightGrayFront, back: sweatshirtLightGrayBack },
  "#eec98a": { front: sweatshirtSandFront, back: sweatshirtSandBack },
  "#ef000b": { front: sweatshirtRedFront, back: sweatshirtRedBack },
  "#ffffff": { front: sweatshirtWhiteFront, back: sweatshirtWhiteBack },
};

const PRODUCT_BASE_IMAGES: Record<CustomProductSlug, Record<string, MockupImagePair>> = {
  tshirt: TSHIRT_COLOR_IMAGES,
  hoodie: HOODIE_COLOR_IMAGES,
  sweater: SWEATSHIRT_COLOR_IMAGES,
  glasscup: { default: { front: glassCupImage, back: glassCupImage } },
  hat: { default: { front: hatImage, back: hatImage } },
  apron: { default: { front: apronImage, back: apronImage } },
  totebag: { default: { front: totebagImage, back: totebagImage } },
};

function getDefaultTransform(productType: CustomProductSlug): DesignTransform {
  return productType === "tshirt"
    ? { x: CENTER_X, y: CENTER_Y, scale: 1, rotationDeg: 0 }
    : { x: CENTER_X, y: CENTER_Y, scale: 1, rotationDeg: 0 };
}

function getCanvasPoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: ((clientX - rect.left) / rect.width) * canvas.width,
    y: ((clientY - rect.top) / rect.height) * canvas.height,
  };
}

function getDesignDimensionsFromNatural(
  naturalWidth: number,
  naturalHeight: number,
  scale: number
) {
  const maxBaseSize = 60;
  const ratio = Math.min(
    maxBaseSize / naturalWidth,
    maxBaseSize / naturalHeight
  );

  return {
    width: naturalWidth * ratio * scale,
    height: naturalHeight * ratio * scale,
  };
}

function getDesignDimensions(image: HTMLImageElement, scale: number) {
  return getDesignDimensionsFromNatural(image.naturalWidth, image.naturalHeight, scale);
}

function getHandleAtPoint(
  point: { x: number; y: number },
  transform: { x: number; y: number; scale: number; rotationDeg: number },
  designImage: HTMLImageElement
): "tl" | "tr" | "br" | "bl" | "rot" | null {
  const { x, y, rotationDeg } = transform;
  const { width, height } = getDesignDimensions(designImage, transform.scale);
  const hw = width / 2;
  const hh = height / 2;
  const rad = (rotationDeg * Math.PI) / 180;

  const dx = point.x - x;
  const dy = point.y - y;
  const cos = Math.cos(-rad);
  const sin = Math.sin(-rad);
  const lx = dx * cos - dy * sin;
  const ly = dx * sin + dy * cos;

  const rotHandleLocalY = -hh - ROT_HANDLE_DIST;
  const distToRot = Math.sqrt(lx * lx + (ly - rotHandleLocalY) ** 2);
  if (distToRot <= ROT_HANDLE_RADIUS + 6) return "rot";

  const cornerHitSize = HANDLE_SIZE + 6;
  const corners: Array<[number, number, "tl" | "tr" | "br" | "bl"]> = [
    [-hw, -hh, "tl"],
    [hw, -hh, "tr"],
    [hw, hh, "br"],
    [-hw, hh, "bl"],
  ];

  for (const [cx, cy, label] of corners) {
    if (
      Math.abs(lx - cx) <= cornerHitSize &&
      Math.abs(ly - cy) <= cornerHitSize
    ) {
      return label;
    }
  }

  return null;
}

function getDistanceFromCenter(
  point: { x: number; y: number },
  center: { x: number; y: number }
) {
  return Math.sqrt((point.x - center.x) ** 2 + (point.y - center.y) ** 2);
}

function getAngleDeg(
  point: { x: number; y: number },
  center: { x: number; y: number }
) {
  return Math.atan2(point.y - center.y, point.x - center.x) * (180 / Math.PI);
}

function drawBaseProduct(
  canvas: HTMLCanvasElement,
  productName: string,
  colorHex: string,
  baseImage?: HTMLImageElement | null
) {
  const context = canvas.getContext("2d");

  if (!context) return;

  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#fdfaf0";
  context.fillRect(0, 0, width, height);

  if (baseImage) {
    const scale = Math.min(
      canvas.width / baseImage.naturalWidth,
      canvas.height / baseImage.naturalHeight
    );
    const drawWidth = baseImage.naturalWidth * scale;
    const drawHeight = baseImage.naturalHeight * scale;
    const offsetX = (canvas.width - drawWidth) / 2;
    const offsetY = (canvas.height - drawHeight) / 2;
    context.drawImage(baseImage, offsetX, offsetY, drawWidth, drawHeight);

    return;
  }

  context.fillStyle = "rgba(0, 0, 0, 0.08)";
  context.beginPath();
  context.ellipse(width / 2, height - 54, 140, 26, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = colorHex;
  context.strokeStyle = "rgba(20, 20, 20, 0.2)";
  context.lineWidth = 4;

  switch (productName) {
    case "T-shirt":
      context.beginPath();
      context.moveTo(115, 118);
      context.lineTo(165, 86);
      context.lineTo(205, 118);
      context.lineTo(225, 96);
      context.lineTo(274, 128);
      context.lineTo(248, 175);
      context.lineTo(231, 165);
      context.lineTo(231, 345);
      context.lineTo(89, 345);
      context.lineTo(89, 165);
      context.lineTo(72, 175);
      context.lineTo(46, 128);
      context.lineTo(95, 96);
      context.closePath();
      break;
    case "Hoodie":
      context.beginPath();
      context.moveTo(108, 120);
      context.quadraticCurveTo(160, 70, 212, 120);
      context.lineTo(248, 150);
      context.lineTo(228, 346);
      context.lineTo(92, 346);
      context.lineTo(72, 150);
      context.closePath();
      context.moveTo(136, 123);
      context.quadraticCurveTo(160, 100, 184, 123);
      break;
    case "Sweater":
      context.beginPath();
      context.moveTo(92, 104);
      context.lineTo(118, 84);
      context.lineTo(142, 112);
      context.lineTo(178, 112);
      context.lineTo(202, 84);
      context.lineTo(228, 104);
      context.lineTo(258, 150);
      context.lineTo(233, 174);
      context.lineTo(222, 346);
      context.lineTo(98, 346);
      context.lineTo(88, 174);
      context.lineTo(62, 150);
      context.closePath();
      break;
    case "Glass cup":
      context.beginPath();
      context.moveTo(160, 92);
      context.lineTo(360, 92);
      context.lineTo(330, 410);
      context.lineTo(190, 410);
      context.closePath();
      break;
    case "Hat":
      context.beginPath();
      context.ellipse(width / 2, 190, 110, 72, 0, Math.PI, 0, true);
      context.lineTo(318, 198);
      context.quadraticCurveTo(260, 265, 202, 198);
      context.closePath();
      break;
    case "Apron":
      context.beginPath();
      context.moveTo(180, 82);
      context.lineTo(340, 82);
      context.lineTo(390, 150);
      context.lineTo(340, 420);
      context.lineTo(180, 420);
      context.lineTo(130, 150);
      context.closePath();
      break;
    case "Tote bag":
      context.beginPath();
      context.moveTo(150, 150);
      context.lineTo(370, 150);
      context.lineTo(335, 430);
      context.lineTo(185, 430);
      context.closePath();
      context.moveTo(205, 150);
      context.quadraticCurveTo(205, 88, 260, 88);
      context.quadraticCurveTo(315, 88, 315, 150);
      break;
    default:
      context.fillRect(120, 120, 280, 240);
  }

  context.fill();
  context.stroke();

}

export function ProductCustomizer({ productType }: ProductCustomizerProps) {
  const product = customProductMap[productType];
  const productOptions = PRODUCT_OPTIONS_CONFIG[productType];
  const showSideControls = productOptions.showMaterial;
  const { increaseCartQuantity } = useShoppingCart();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const designTransforms = useRef<DesignTransformMap>({
    front: getDefaultTransform(productType),
    back: getDefaultTransform(productType),
  });
  const showHandlesRef = useRef(false);
  const dragStateRef = useRef<{
    mode: DragMode | null;
    offsetX: number;
    offsetY: number;
    startAngle: number;
    startRotation: number;
    startScale: number;
    startDist: number;
    startX: number;
    startY: number;
  }>({
    mode: null,
    offsetX: 0,
    offsetY: 0,
    startAngle: 0,
    startRotation: 0,
    startScale: 1,
    startDist: 0,
    startX: 0,
    startY: 0,
  });
  const activeDesignImageRef = useRef<HTMLImageElement | null>(null);
  const baseProductImageRef = useRef<HTMLImageElement | null>(null);

  const [selectedColor, setSelectedColor] = useState(colorOptions[0].label);
  const [selectedSize, setSelectedSize] = useState(AVAILABLE_SIZES[0]);
  const currentPrice = productOptions.showSize
    ? (SIZE_PRICES[selectedSize] ?? 17.0)
    : 17.0;
  const [selectedGenderFit, setSelectedGenderFit] = useState(AVAILABLE_GENDER_FITS[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(AVAILABLE_MATERIALS[0].label);
  const [uploadedDesigns, setUploadedDesigns] = useState<DesignOption[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [scaleValue, setScaleValue] = useState(1);
  const [rotationValue, setRotationValue] = useState(0);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [activeSide, setActiveSide] = useState<MockupSide>("front");
  const [sideDesigns, setSideDesigns] = useState<DesignSidesState>({
    front: AVAILABLE_DESIGNS[0].id,
    back: AVAILABLE_DESIGNS[0].id,
  });
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [activeDesignNaturalSize, setActiveDesignNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const availableDesigns = useMemo(
    () => [...AVAILABLE_DESIGNS, ...uploadedDesigns],
    [uploadedDesigns]
  );

  const activeDesignId = sideDesigns[activeSide];

  const activeDesign = useMemo(
    () => availableDesigns.find((design) => design.id === activeDesignId) ?? availableDesigns[0],
    [activeDesignId, availableDesigns]
  );

  const selectedColorValue = useMemo(
    () => colorOptions.find((option) => option.label === selectedColor)?.value ?? colorOptions[0].value,
    [selectedColor]
  );

  const selectedBaseImage = useMemo(() => {
    const productImages = PRODUCT_BASE_IMAGES[productType];
    const imagePair =
      productImages[selectedColorValue] ??
      productImages.default;
    const candidate = imagePair?.[activeSide] || imagePair?.front;
    return candidate || undefined;
  }, [activeSide, productType, selectedColorValue]);

  const visibleDesigns = useMemo(
    () => availableDesigns.slice(visibleStartIndex, visibleStartIndex + 3),
    [availableDesigns, visibleStartIndex]
  );

  const dimensionReadout = useMemo(() => {
    if (!activeDesignNaturalSize) return null;

    const { width, height } = getDesignDimensionsFromNatural(
      activeDesignNaturalSize.width,
      activeDesignNaturalSize.height,
      scaleValue
    );

    return {
      width: (width / CANVAS_PX_PER_INCH).toFixed(1),
      height: (height / CANVAS_PX_PER_INCH).toFixed(1),
    };
  }, [activeDesignNaturalSize, scaleValue]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const designImage = activeDesignImageRef.current;

    if (!canvas) return;

    drawBaseProduct(
      canvas,
      product.name,
      selectedColorValue,
      baseProductImageRef.current
    );

    if (!designImage) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const { x, y, scale, rotationDeg } = designTransforms.current[activeSide];
    const { width, height } = getDesignDimensions(designImage, scale);
    const hw = width / 2;
    const hh = height / 2;

    context.save();
    context.translate(x, y);
    context.rotate((rotationDeg * Math.PI) / 180);
    context.drawImage(designImage, -width / 2, -height / 2, width, height);
    context.restore();

    if (showHandlesRef.current) {
      context.save();
      context.translate(x, y);
      context.rotate((rotationDeg * Math.PI) / 180);

      context.strokeStyle = "rgba(136, 76, 66, 0.7)";
      context.lineWidth = 1.5;
      context.setLineDash([5, 4]);
      context.strokeRect(-hw, -hh, width, height);
      context.setLineDash([]);

      context.fillStyle = "#ffffff";
      context.strokeStyle = "#884c42";
      context.lineWidth = 1.5;
      const corners = [
        { x: -hw, y: -hh },
        { x: hw, y: -hh },
        { x: hw, y: hh },
        { x: -hw, y: hh },
      ];

      corners.forEach((corner) => {
        context.fillRect(
          corner.x - HANDLE_SIZE,
          corner.y - HANDLE_SIZE,
          HANDLE_SIZE * 2,
          HANDLE_SIZE * 2
        );
        context.strokeRect(
          corner.x - HANDLE_SIZE,
          corner.y - HANDLE_SIZE,
          HANDLE_SIZE * 2,
          HANDLE_SIZE * 2
        );
      });

      context.beginPath();
      context.strokeStyle = "#884c42";
      context.lineWidth = 1.5;
      context.moveTo(0, -hh);
      context.lineTo(0, -hh - ROT_HANDLE_DIST);
      context.stroke();

      context.beginPath();
      context.arc(0, -hh - ROT_HANDLE_DIST, ROT_HANDLE_RADIUS, 0, Math.PI * 2);
      context.fillStyle = "#884c42";
      context.fill();
      context.strokeStyle = "#ffffff";
      context.lineWidth = 1.5;
      context.stroke();

      context.restore();
    }
  }, [activeSide, product.name, productType, selectedColorValue, showSideControls]);

  useEffect(() => {
    if (!selectedBaseImage) {
      baseProductImageRef.current = null;
      redrawCanvas();
      return;
    }

    const image = new Image();
    image.onload = () => {
      baseProductImageRef.current = image;
      redrawCanvas();
    };
    image.onerror = () => {
      baseProductImageRef.current = null;
      redrawCanvas();
    };
    image.src = selectedBaseImage;
  }, [redrawCanvas, selectedBaseImage]);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      activeDesignImageRef.current = image;
      setActiveDesignNaturalSize({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      redrawCanvas();
    };

    image.onerror = () => {
      activeDesignImageRef.current = null;
      setActiveDesignNaturalSize(null);
      redrawCanvas();
    };

    image.src = activeDesign.imageUrl;
  }, [activeDesign.imageUrl, redrawCanvas]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    const activeIndex = availableDesigns.findIndex((design) => design.id === activeDesignId);

    if (activeIndex === -1) return;
    if (activeIndex < visibleStartIndex) {
      setVisibleStartIndex(activeIndex);
      return;
    }
    if (activeIndex >= visibleStartIndex + 3) {
      setVisibleStartIndex(Math.max(0, activeIndex - 2));
    }
  }, [activeDesignId, availableDesigns, visibleStartIndex]);

  const beginDrag = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const designImage = activeDesignImageRef.current;
    if (!canvas || !designImage) return false;

    const point = getCanvasPoint(canvas, clientX, clientY);
    const transform = designTransforms.current[activeSide];
    const handle = getHandleAtPoint(point, transform, designImage);

    if (handle === "rot") {
      dragStateRef.current = {
        ...dragStateRef.current,
        mode: "rotate",
        startAngle: getAngleDeg(point, transform),
        startRotation: transform.rotationDeg,
      };
      return true;
    }

    if (handle && handle !== null) {
      dragStateRef.current = {
        ...dragStateRef.current,
        mode: `scale-${handle}` as DragMode,
        startScale: transform.scale,
        startDist: getDistanceFromCenter(point, transform),
        startX: transform.x,
        startY: transform.y,
      };
      return true;
    }

    const { width, height } = getDesignDimensions(designImage, transform.scale);
    const rad = (transform.rotationDeg * Math.PI) / 180;
    const dx = point.x - transform.x;
    const dy = point.y - transform.y;
    const cos = Math.cos(-rad);
    const sin = Math.sin(-rad);
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;

    if (
      Math.abs(lx) <= width / 2 &&
      Math.abs(ly) <= height / 2
    ) {
      dragStateRef.current = {
        ...dragStateRef.current,
        mode: "move",
        offsetX: point.x - transform.x,
        offsetY: point.y - transform.y,
      };
      return true;
    }

    return false;
  }, [activeSide]);

  const updateDrag = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const designImage = activeDesignImageRef.current;
    if (!canvas || !dragStateRef.current.mode) return;
    showHandlesRef.current = true;

    const point = getCanvasPoint(canvas, clientX, clientY);
    const transform = designTransforms.current[activeSide];
    const ds = dragStateRef.current;

    if (ds.mode === "move") {
      transform.x = point.x - ds.offsetX;
      transform.y = point.y - ds.offsetY;
    } else if (ds.mode === "rotate") {
      const currentAngle = getAngleDeg(point, transform);
      const delta = currentAngle - ds.startAngle;
      const newRot = Math.round(ds.startRotation + delta);
      transform.rotationDeg = newRot;
      setRotationValue(newRot);
    } else if (ds.mode && ds.mode.startsWith("scale-") && designImage) {
      const currentDist = getDistanceFromCenter(point, transform);
      const ratio = currentDist / ds.startDist;
      const newScale = Math.min(3, Math.max(0.2,
        Number((ds.startScale * ratio).toFixed(3))
      ));
      transform.scale = newScale;
      setScaleValue(newScale);
    }

    redrawCanvas();
  }, [activeSide, redrawCanvas]);

  const stopDrag = useCallback(() => {
    dragStateRef.current.mode = null;
    showHandlesRef.current = false;
    redrawCanvas();
  }, [redrawCanvas]);

  const resetPosition = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    designTransforms.current[activeSide] = showSideControls
      ? getDefaultTransform(productType)
      : {
          x: canvas.width / 2,
          y: canvas.height / 2,
          scale: 1,
          rotationDeg: 0,
        };
    setScaleValue(1);
    setRotationValue(0);
    redrawCanvas();
  }, [activeSide, productType, redrawCanvas, showSideControls]);

  const switchSide = useCallback((nextSide: MockupSide) => {
    if (nextSide === activeSide) return;

    const nextTransform = designTransforms.current[nextSide];
    setActiveSide(nextSide);
    setScaleValue(nextTransform.scale);
    setRotationValue(nextTransform.rotationDeg);
  }, [activeSide]);

  const placeDesign = useCallback((placement: keyof typeof PLACEMENT_ZONES) => {
    const zone = activeSide === "back" ? PLACEMENT_ZONES_BACK[placement] : PLACEMENT_ZONES[placement];
    const transform = designTransforms.current[activeSide];

    transform.x = zone.x;
    transform.y = zone.y;
    setScaleValue(transform.scale);
    setRotationValue(transform.rotationDeg);
    redrawCanvas();
  }, [activeSide, redrawCanvas]);

  const selectDesign = useCallback((designId: string) => {
    setSideDesigns((current) => ({
      ...current,
      [activeSide]: designId,
    }));
  }, [activeSide]);

  const handleUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || file.type !== "image/png") return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload-design", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? "Upload failed — please try a PNG under 20MB");
      }

      const data = (await res.json()) as { url: string };
      const proxyUrl = `/api/design-image?url=${encodeURIComponent(data.url)}`;
      const customDesign: DesignOption = {
        id: `custom-upload-${Date.now()}`,
        label: "My Design",
        sourceType: "upload",
        imageUrl: proxyUrl,
        fulfillmentUrl: data.url,
      };

      setUploadedDesigns((prev) => [...prev, customDesign]);
      setSideDesigns((current) => ({
        ...current,
        [activeSide]: customDesign.id,
      }));
      designTransforms.current[activeSide] = getDefaultTransform(productType);
      setScaleValue(1);
      setRotationValue(0);
      setVisibleStartIndex(Math.max(availableDesigns.length - 1, 0));
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Upload failed — please try a PNG under 20MB"
      );
      event.target.value = "";
    } finally {
      setIsUploading(false);
    }
  }, [activeSide, availableDesigns.length, productType]);

  const handleAddToCart = useCallback(() => {
    const frontDesign =
      availableDesigns.find((design) => design.id === sideDesigns.front) ?? availableDesigns[0];
    const backDesign =
      availableDesigns.find((design) => design.id === sideDesigns.back) ?? availableDesigns[0];
    const representativeDesign = showSideControls ? frontDesign : activeDesign;
    const representativeTransform = showSideControls
      ? designTransforms.current.front
      : designTransforms.current[activeSide];

    const customization: CartItemCustomization = {
      productType,
      color: productOptions.showColor ? selectedColor : undefined,
      size: productOptions.showSize ? selectedSize : undefined,
      genderFit: productOptions.showGenderFit ? selectedGenderFit : undefined,
      material: productOptions.showMaterial ? selectedMaterial : undefined,
      design: {
        id: representativeDesign.id,
        label: representativeDesign.label,
        sourceType: representativeDesign.sourceType,
        imageUrl: representativeDesign.fulfillmentUrl ?? representativeDesign.imageUrl,
      },
      transform: { ...representativeTransform },
      sides: showSideControls
        ? {
            front: {
              designId: frontDesign.id,
              designLabel: frontDesign.label,
              sourceType: frontDesign.sourceType,
              designUrl: frontDesign.fulfillmentUrl ?? frontDesign.imageUrl,
              transform: { ...designTransforms.current.front },
            },
            back: {
              designId: backDesign.id,
              designLabel: backDesign.label,
              sourceType: backDesign.sourceType,
              designUrl: backDesign.fulfillmentUrl ?? backDesign.imageUrl,
              transform: { ...designTransforms.current.back },
            },
          }
        : undefined,
    };

    increaseCartQuantity(
      product.id,
      productOptions.showSize ? selectedSize : "",
      customization,
      currentPrice
    );
    setSaveMessage("Added to cart");
    window.setTimeout(() => setSaveMessage(null), 2500);
  }, [
    activeDesign,
    activeSide,
    availableDesigns,
    currentPrice,
    increaseCartQuantity,
    product.id,
    productOptions.showColor,
    productOptions.showGenderFit,
    productOptions.showMaterial,
    productOptions.showSize,
    productType,
    selectedColor,
    selectedGenderFit,
    selectedMaterial,
    selectedSize,
    showSideControls,
    sideDesigns,
  ]);

  return (
    <div className="py-2">
      <div className="text-center mb-4">
        <p className="eyebrow" style={{ color: "var(--slp-clay)" }}>
          Product Customizer
        </p>
        <h1 className="fw-bold mb-2" style={{ color: "var(--slp-clay)" }}>
          {product.name}
        </h1>
        <p className="text-secondary mb-3">
          Drag the design on the mockup to position it.
        </p>
        <Link to="/" className="btn btn-outline-dark">
          Back to Home
        </Link>
      </div>

      <div className="customizer-hero">
        {showSideControls ? (
          <div className="side-toggle">
            <button
              type="button"
              className={activeSide === "front" ? "active" : ""}
              onClick={() => switchSide("front")}
            >
              Front
            </button>
            <button
              type="button"
              className={activeSide === "back" ? "active" : ""}
              onClick={() => switchSide("back")}
            >
              Back
            </button>
          </div>
        ) : null}

        {showSideControls ? (
          <div className="placement-buttons">
            <button type="button" onClick={() => placeDesign("chest-left")}>
              ↖ Left Chest
            </button>
            <button type="button" onClick={() => placeDesign("chest-center")}>
              ↑ Center
            </button>
            <button type="button" onClick={() => placeDesign("chest-right")}>
              ↗ Right Chest
            </button>
          </div>
        ) : null}

        <canvas
          ref={canvasRef}
          width={680}
          height={480}
          className="customizer-canvas"
          style={{ touchAction: "none", cursor: "grab" }}
          onMouseDown={(event) => {
            if (beginDrag(event.clientX, event.clientY)) {
              event.currentTarget.style.cursor = "grabbing";
            }
          }}
          onMouseMove={(event) => {
            if (dragStateRef.current.mode) {
              updateDrag(event.clientX, event.clientY);
              return;
            }
            const canvas = canvasRef.current;
            const designImage = activeDesignImageRef.current;
            if (!canvas || !designImage) return;
            const point = getCanvasPoint(canvas, event.clientX, event.clientY);
            const transform = designTransforms.current[activeSide];
            const handle = getHandleAtPoint(point, transform, designImage);
            if (handle === "rot") {
              event.currentTarget.style.cursor = "crosshair";
            } else if (handle === "tl" || handle === "br") {
              event.currentTarget.style.cursor = "nwse-resize";
            } else if (handle === "tr" || handle === "bl") {
              event.currentTarget.style.cursor = "nesw-resize";
            } else {
              event.currentTarget.style.cursor = "grab";
            }

            const isOverDesign = handle !== null || (() => {
              if (!designImage) return false;
              const transform = designTransforms.current[activeSide];
              const { width, height } = getDesignDimensions(
                designImage, transform.scale
              );
              const rad = (transform.rotationDeg * Math.PI) / 180;
              const dx = point.x - transform.x;
              const dy = point.y - transform.y;
              const cos = Math.cos(-rad);
              const sin = Math.sin(-rad);
              const lx = dx * cos - dy * sin;
              const ly = dx * sin + dy * cos;
              return Math.abs(lx) <= width / 2 && Math.abs(ly) <= height / 2;
            })();

            if (showHandlesRef.current !== isOverDesign) {
              showHandlesRef.current = isOverDesign;
              redrawCanvas();
            }
          }}
          onMouseUp={(event) => {
            stopDrag();
            event.currentTarget.style.cursor = "grab";
          }}
          onMouseLeave={(event) => {
            stopDrag();
            event.currentTarget.style.cursor = "grab";
            showHandlesRef.current = false;
            redrawCanvas();
          }}
          onTouchStart={(event) => {
            const touch = event.touches[0];
            if (!touch) return;
            if (beginDrag(touch.clientX, touch.clientY)) {
              event.preventDefault();
            }
          }}
          onTouchMove={(event) => {
            const touch = event.touches[0];
            if (!touch || !dragStateRef.current.mode) return;
            event.preventDefault();
            updateDrag(touch.clientX, touch.clientY);
          }}
          onTouchEnd={() => stopDrag()}
        />

        <div className="mockup-info-bar">
          <span>{product.name}</span>
          {productOptions.showSize && selectedSize ? <span>Size: {selectedSize}</span> : null}
          {productOptions.showMaterial && selectedMaterial ? <span>{selectedMaterial}</span> : null}
          {showSideControls ? <span className="text-capitalize">{activeSide}</span> : null}
        </div>

        <div className="canvas-meta-row">
          {dimensionReadout ? (
            <span className="dimension-readout">
              Print size: {dimensionReadout.width}" × {dimensionReadout.height}"
            </span>
          ) : null}
          <span className="dimension-readout">
            {Math.round(scaleValue * 100)}%
          </span>
          <span className="dimension-readout">
            {rotationValue}°
          </span>
          <button className="reset-link" onClick={resetPosition}>
            Reset
          </button>
        </div>
      </div>

      <div className="customizer-controls-panel customizer-panel">
        {productOptions.showColor ? (
          <div className="control-group">
            <span className="control-group-label">Color</span>
            <div className="d-flex flex-wrap gap-2">
              {colorOptions.map((option) => {
                const isSelected = selectedColor === option.label;

                return (
                  <button
                    key={option.label}
                    type="button"
                    aria-label={option.label}
                    title={option.label}
                    onClick={() => setSelectedColor(option.label)}
                    className="btn p-0 d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      backgroundColor: option.value,
                      border: option.label === "White" ? "1px solid #ccc" : "1px solid transparent",
                      boxShadow: isSelected ? "0 0 0 3px var(--slp-clay)" : "0 0 0 1px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    {isSelected ? (
                      <span
                        style={{
                          color:
                            option.label === "Light Gray" ||
                            option.label === "Sand" ||
                            option.label === "White"
                              ? "#212529"
                              : "#ffffff",
                          fontSize: "1rem",
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        ✓
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {productOptions.showSize ? (
          <div className="control-group">
            <span className="control-group-label">Size</span>
            <Form.Select value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}>
              {AVAILABLE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Form.Select>
          </div>
        ) : null}

        {productOptions.showGenderFit ? (
          <div className="control-group">
            <span className="control-group-label">Fit</span>
            <Form.Select
              value={selectedGenderFit}
              onChange={(event) => setSelectedGenderFit(event.target.value)}
            >
              {AVAILABLE_GENDER_FITS.map((fit) => (
                <option key={fit} value={fit}>
                  {fit}
                </option>
              ))}
            </Form.Select>
          </div>
        ) : null}

        {productOptions.showMaterial ? (
          <div className="control-group">
            <span className="control-group-label">Material</span>
            <Form.Select value={selectedMaterial} onChange={(event) => setSelectedMaterial(event.target.value)}>
              {AVAILABLE_MATERIALS.map((material) => (
                <option key={material.value} value={material.label}>
                  {material.label}
                </option>
              ))}
            </Form.Select>
          </div>
        ) : null}

        <div className="control-group control-group--wide">
          <span className="control-group-label">Design</span>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="design-picker-arrow"
              onClick={() => setVisibleStartIndex((current) => Math.max(current - 1, 0))}
              disabled={visibleStartIndex === 0}
            >
              ‹
            </button>
            <div className="d-flex gap-2 flex-grow-1">
              {visibleDesigns.map((design) => {
                const isSelected = activeDesignId === design.id;

                return (
                  <button
                    key={design.id}
                    type="button"
                    onClick={() => selectDesign(design.id)}
                    className="btn p-2 text-center flex-fill"
                    style={{
                      minWidth: 0,
                      borderRadius: "12px",
                      border: isSelected ? "2px solid var(--slp-clay)" : "1px solid var(--slp-sand)",
                      backgroundColor: "#ffffff",
                      boxShadow: isSelected ? "0 0 0 2px rgba(136, 76, 66, 0.12)" : "none",
                    }}
                  >
                    <img
                      src={design.imageUrl}
                      alt={design.label}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto 0.5rem",
                      }}
                    />
                    <span className="small fw-semibold d-block text-truncate">{design.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="design-picker-arrow"
              onClick={() =>
                setVisibleStartIndex((current) =>
                  Math.min(current + 1, Math.max(availableDesigns.length - 3, 0))
                )
              }
              disabled={visibleStartIndex + 3 >= availableDesigns.length}
            >
              ›
            </button>
          </div>
          {isUploading ? (
            <div className="d-flex align-items-center gap-2 small fw-semibold text-secondary">
              <Spinner animation="border" size="sm" />
              Uploading design...
            </div>
          ) : null}
        </div>

        <div className="control-group control-group--wide">
          <span className="control-group-label">Upload</span>
          <Form.Control type="file" accept="image/png" onChange={handleUpload} />
          <Form.Text className="text-secondary">
            PNG only. Uploaded designs stay available while this page remains open.
          </Form.Text>
          {uploadError ? <div className="text-danger small mt-2">{uploadError}</div> : null}
        </div>
      </div>

      <div className="customizer-footer-row">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          {productOptions.showColor ? <Badge bg="dark">{selectedColor}</Badge> : null}
          {productOptions.showSize ? <Badge bg="secondary">{selectedSize}</Badge> : null}
          {productOptions.showGenderFit ? <Badge bg="info">{selectedGenderFit}</Badge> : null}
          <Badge bg="warning" text="dark">{activeDesign.label}</Badge>
          {productOptions.showMaterial ? <Badge bg="success">{selectedMaterial}</Badge> : null}
          {showSideControls ? <Badge bg="light" text="dark" className="text-capitalize">{activeSide}</Badge> : null}
          {saveMessage ? <div className="save-toast">✓ {saveMessage}</div> : null}
        </div>

        <div className="d-flex flex-column align-items-end">
          <div className="customizer-price">${currentPrice.toFixed(2)}</div>
          <button
            type="button"
            className="btn btn-brand btn-lg"
            onClick={handleAddToCart}
            disabled={isUploading || (activeDesign.sourceType === "upload" && !activeDesign.imageUrl)}
            style={{ minWidth: "200px", borderRadius: "999px" }}
          >
            {isUploading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Uploading design...
              </>
            ) : (
              "Add to cart"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
