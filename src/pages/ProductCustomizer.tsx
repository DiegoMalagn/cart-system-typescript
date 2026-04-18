import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Alert, Badge, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import design1 from "../assets/designs/stampDesign1.png";
import design2 from "../assets/designs/stampDesign2.png";
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

const mockupAssets = import.meta.glob("../assets/mockups/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const mockupAssetMap = Object.fromEntries(
  Object.entries(mockupAssets).map(([path, url]) => [path.split("/").pop() ?? path, url])
);

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
];

const AVAILABLE_MATERIALS = [
  { value: "cotton", label: "100% Cotton" },
  // future: { value: "blend", label: "Cotton-Polyester Blend" },
];

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];
// future: add XS, 4XL etc. here

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

const COLOR_KEY_BY_HEX: Record<string, string> = {
  "#221d19": "black",
  "#3b525f": "slate",
  "#40382d": "olive",
  "#6e222c": "burgundy",
  "#e7ece7": "lightgray",
  "#eec98a": "sand",
  "#ef000b": "red",
  "#ffffff": "white",
};

const TSHIRT_PRINT_AREA = { x: 160, y: 180, width: 220, height: 220 };
const PLACEMENT_ZONES = {
  "chest-left": { x: 185, y: 195 },
  "chest-center": { x: 260, y: 200 },
  "chest-right": { x: 335, y: 195 },
} as const;

const CANVAS_PX_PER_INCH = 43.3;

function getMockupAsset(filename: string) {
  return mockupAssetMap[filename] ?? "";
}

function buildApparelMockupPair(productPrefix: string, colorKey: string, fallbackColorKey?: string): MockupImagePair {
  const front =
    getMockupAsset(`${productPrefix}-${colorKey}-front.png`) ||
    getMockupAsset(`${productPrefix}-${fallbackColorKey ?? colorKey}-front.png`) ||
    getMockupAsset(`${productPrefix}-${colorKey}.png`) ||
    getMockupAsset(`${productPrefix}-${fallbackColorKey ?? colorKey}.png`);

  const back =
    getMockupAsset(`${productPrefix}-${colorKey}-back.png`) ||
    getMockupAsset(`${productPrefix}-${fallbackColorKey ?? colorKey}-back.png`) ||
    front;

  return {
    front,
    back: back || front,
  };
}

function buildColorImageMap(productPrefix: string, fallbackColorKey?: string) {
  return Object.fromEntries(
    Object.entries(COLOR_KEY_BY_HEX).map(([hex, colorKey]) => [
      hex,
      buildApparelMockupPair(productPrefix, colorKey, fallbackColorKey),
    ])
  ) as Record<string, MockupImagePair>;
}

function buildSingleImagePair(filename: string): MockupImagePair {
  const asset = getMockupAsset(filename);
  return {
    front: asset,
    back: asset,
  };
}

const TSHIRT_COLOR_IMAGES: Record<string, MockupImagePair> = buildColorImageMap("tshirt");

const PRODUCT_BASE_IMAGES: Record<CustomProductSlug, Record<string, MockupImagePair>> = {
  tshirt: TSHIRT_COLOR_IMAGES,
  hoodie: buildColorImageMap("hoodie", "black"),
  sweater: buildColorImageMap("sweater", "black"),
  glasscup: { default: buildSingleImagePair("glasscup.png") },
  hat: { default: buildSingleImagePair("hat.png") },
  apron: { default: buildSingleImagePair("apron.png") },
  totebag: { default: buildSingleImagePair("totebag.png") },
};

function getDefaultTransform(productType: CustomProductSlug): DesignTransform {
  return productType === "tshirt"
    ? { x: 260, y: 220, scale: 1, rotationDeg: 0 }
    : { x: 260, y: 260, scale: 1, rotationDeg: 0 };
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
  const maxBaseSize = 110;
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

function drawBaseProduct(
  canvas: HTMLCanvasElement,
  productName: string,
  colorHex: string,
  baseImage?: HTMLImageElement | null,
  showPrintArea?: boolean
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

    if (showPrintArea) {
      context.save();
      context.strokeStyle = "rgba(136, 76, 66, 0.22)";
      context.lineWidth = 1;
      context.setLineDash([6, 5]);
      context.strokeRect(
        TSHIRT_PRINT_AREA.x,
        TSHIRT_PRINT_AREA.y,
        TSHIRT_PRINT_AREA.width,
        TSHIRT_PRINT_AREA.height
      );
      context.restore();
    }

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

  if (showPrintArea) {
    context.save();
    context.strokeStyle = "rgba(136, 76, 66, 0.22)";
    context.lineWidth = 1;
    context.setLineDash([6, 5]);
    context.strokeRect(
      TSHIRT_PRINT_AREA.x,
      TSHIRT_PRINT_AREA.y,
      TSHIRT_PRINT_AREA.width,
      TSHIRT_PRINT_AREA.height
    );
    context.restore();
  }
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
  const dragStateRef = useRef({ isDragging: false, offsetX: 0, offsetY: 0 });
  const activeDesignImageRef = useRef<HTMLImageElement | null>(null);
  const baseProductImageRef = useRef<HTMLImageElement | null>(null);

  const [selectedColor, setSelectedColor] = useState(colorOptions[0].label);
  const [selectedSize, setSelectedSize] = useState(AVAILABLE_SIZES[0]);
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
      baseProductImageRef.current,
      showSideControls
    );

    if (!designImage) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const { x, y, scale, rotationDeg } = designTransforms.current[activeSide];
    const { width, height } = getDesignDimensions(designImage, scale);

    context.save();
    context.translate(x, y);
    context.rotate((rotationDeg * Math.PI) / 180);
    context.drawImage(designImage, -width / 2, -height / 2, width, height);
    context.strokeStyle = "rgba(136, 76, 66, 0.42)";
    context.lineWidth = 1.2;
    context.setLineDash([6, 4]);
    context.strokeRect(-width / 2, -height / 2, width, height);
    context.setLineDash([]);
    context.restore();
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
    const { x, y, scale } = designTransforms.current[activeSide];
    const { width, height } = getDesignDimensions(designImage, scale);
    const left = x - width / 2;
    const top = y - height / 2;

    if (
      point.x < left ||
      point.x > left + width ||
      point.y < top ||
      point.y > top + height
    ) {
      return false;
    }

    dragStateRef.current = {
      isDragging: true,
      offsetX: point.x - x,
      offsetY: point.y - y,
    };

    return true;
  }, [activeSide]);

  const updateDrag = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;

    if (!canvas || !dragStateRef.current.isDragging) return;

    const point = getCanvasPoint(canvas, clientX, clientY);
    const transform = designTransforms.current[activeSide];
    transform.x = point.x - dragStateRef.current.offsetX;
    transform.y = point.y - dragStateRef.current.offsetY;
    redrawCanvas();
  }, [activeSide, redrawCanvas]);

  const stopDrag = useCallback(() => {
    dragStateRef.current.isDragging = false;
  }, []);

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

  const handleScaleButton = useCallback((delta: number) => {
    const transform = designTransforms.current[activeSide];
    const nextScale = Math.min(
      3,
      Math.max(0.2, Number((transform.scale + delta).toFixed(2)))
    );

    transform.scale = nextScale;
    setScaleValue(nextScale);
    redrawCanvas();
  }, [activeSide, redrawCanvas]);

  const handleScaleSliderChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextScale = Number(event.target.value);

    designTransforms.current[activeSide].scale = nextScale;
    setScaleValue(nextScale);
    redrawCanvas();
  }, [activeSide, redrawCanvas]);

  const handleRotationChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextRotation = Number(event.target.value);

    designTransforms.current[activeSide].rotationDeg = nextRotation;
    setRotationValue(nextRotation);
    redrawCanvas();
  }, [activeSide, redrawCanvas]);

  const switchSide = useCallback((nextSide: MockupSide) => {
    if (nextSide === activeSide) return;

    const nextTransform = designTransforms.current[nextSide];
    setActiveSide(nextSide);
    setScaleValue(nextTransform.scale);
    setRotationValue(nextTransform.rotationDeg);
  }, [activeSide]);

  const placeDesign = useCallback((placement: keyof typeof PLACEMENT_ZONES) => {
    const zone = PLACEMENT_ZONES[placement];
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
      customization
    );
    setSaveMessage("Added to cart");
    window.setTimeout(() => setSaveMessage(null), 2500);
  }, [
    activeDesign,
    activeSide,
    availableDesigns,
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
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <p className="text-uppercase text-secondary fw-semibold mb-1" style={{ letterSpacing: "0.08em" }}>
            Product Customizer
          </p>
          <h1 className="fw-bold mb-2">{product.name}</h1>
          <p className="text-secondary mb-0">
            Build a polished preview with placement, scale, side selection, and design controls.
          </p>
        </div>
        <Link to="/" className="btn btn-outline-dark">
          Back to Home
        </Link>
      </div>

      <Row className="g-4 align-items-start">
        <Col lg={5}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="customizer-panel">
              <h2 className="h5 fw-bold mb-3">Customize</h2>

              {productOptions.showColor ? (
                <Form.Group className="mb-4">
                  <Form.Label>Color</Form.Label>
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
                </Form.Group>
              ) : null}

              {productOptions.showSize ? (
                <Form.Group className="mb-3">
                  <Form.Label>Size</Form.Label>
                  <Form.Select value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}>
                    {AVAILABLE_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ) : null}

              {productOptions.showGenderFit ? (
                <Form.Group className="mb-3">
                  <Form.Label>Fit</Form.Label>
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
                </Form.Group>
              ) : null}

              {productOptions.showMaterial ? (
                <Form.Group className="mb-4">
                  <Form.Label>Material</Form.Label>
                  <Form.Select value={selectedMaterial} onChange={(event) => setSelectedMaterial(event.target.value)}>
                    {AVAILABLE_MATERIALS.map((material) => (
                      <option key={material.value} value={material.label}>
                        {material.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ) : null}

              <Form.Group className="mb-4">
                <Form.Label>Design</Form.Label>
                <div className="d-flex align-items-center gap-2 mb-2">
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
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Upload your own design</Form.Label>
                <Form.Control type="file" accept="image/png" onChange={handleUpload} />
                <Form.Text className="text-secondary">
                  PNG only. Uploaded designs stay available while this page remains open.
                </Form.Text>
                {uploadError ? <div className="text-danger small mt-2">{uploadError}</div> : null}
              </Form.Group>

              <div className="pt-2 border-top">
                <p className="small text-secondary mb-2">Current selections</p>
                <div className="d-flex flex-wrap gap-2">
                  {productOptions.showColor ? <Badge bg="dark">{selectedColor}</Badge> : null}
                  {productOptions.showSize ? <Badge bg="secondary">{selectedSize}</Badge> : null}
                  {productOptions.showGenderFit ? <Badge bg="info">{selectedGenderFit}</Badge> : null}
                  <Badge bg="warning" text="dark">{activeDesign.label}</Badge>
                  {productOptions.showMaterial ? <Badge bg="success">{selectedMaterial}</Badge> : null}
                  {showSideControls ? <Badge bg="light" text="dark" className="text-capitalize">{activeSide}</Badge> : null}
                </div>
              </div>

              {saveMessage ? <Alert variant="success" className="mt-3 mb-0 py-2">{saveMessage}</Alert> : null}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                  <h2 className="h5 fw-bold mb-1">Mockup Preview</h2>
                  <p className="text-secondary mb-0">
                    Drag the design directly on the mockup to place it.
                  </p>
                </div>
                <Badge bg="light" text="dark">
                  {product.tagline}
                </Badge>
              </div>

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

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn customizer-action-btn btn-sm"
                    onClick={() => handleScaleButton(-0.1)}
                  >
                    Smaller
                  </button>
                  <button
                    type="button"
                    className="btn customizer-action-btn btn-sm"
                    onClick={() => handleScaleButton(0.1)}
                  >
                    Larger
                  </button>
                </div>
                <button
                  type="button"
                  className="btn customizer-reset-btn btn-sm text-decoration-none px-0"
                  onClick={resetPosition}
                >
                  Reset position
                </button>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-1">
                  <label htmlFor={`${product.slug}-scale`} className="form-label mb-0">Scale</label>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="small text-secondary">{Math.round(scaleValue * 100)}%</span>
                    {dimensionReadout ? (
                      <span className="dimension-readout">
                        Print size: {dimensionReadout.width}" × {dimensionReadout.height}"
                      </span>
                    ) : null}
                  </div>
                </div>
                <Form.Range
                  id={`${product.slug}-scale`}
                  min={0.2}
                  max={3}
                  step={0.05}
                  value={scaleValue}
                  onChange={handleScaleSliderChange}
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label htmlFor={`${product.slug}-rotation`} className="form-label mb-0">Rotation</label>
                  <span className="small text-secondary">{rotationValue}°</span>
                </div>
                <Form.Range
                  id={`${product.slug}-rotation`}
                  min={-180}
                  max={180}
                  step={1}
                  value={rotationValue}
                  onChange={handleRotationChange}
                />
              </div>

              <div className="customizer-canvas-shell">
                <canvas
                  ref={canvasRef}
                  width={520}
                  height={520}
                  className="w-100"
                  style={{ maxWidth: "520px", display: "block", margin: "0 auto", touchAction: "none", cursor: "grab" }}
                  onMouseDown={(event) => {
                    if (beginDrag(event.clientX, event.clientY)) {
                      event.currentTarget.style.cursor = "grabbing";
                    }
                  }}
                  onMouseMove={(event) => updateDrag(event.clientX, event.clientY)}
                  onMouseUp={(event) => {
                    stopDrag();
                    event.currentTarget.style.cursor = "grab";
                  }}
                  onMouseLeave={(event) => {
                    stopDrag();
                    event.currentTarget.style.cursor = "grab";
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
                    if (!touch || !dragStateRef.current.isDragging) return;
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
              </div>

              <button
                type="button"
                className="btn btn-brand btn-lg w-100 mt-3"
                onClick={handleAddToCart}
                disabled={isUploading || (activeDesign.sourceType === "upload" && !activeDesign.imageUrl)}
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
