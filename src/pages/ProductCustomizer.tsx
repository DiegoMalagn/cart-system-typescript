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
};

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

const PRODUCT_OPTIONS_CONFIG: Record<
  CustomProductSlug,
  { showColor: boolean; showSize: boolean; showMaterial: boolean }
> = {
  tshirt: { showColor: true, showSize: true, showMaterial: true },
  hoodie: { showColor: true, showSize: true, showMaterial: true },
  sweater: { showColor: true, showSize: true, showMaterial: true },
  glasscup: { showColor: false, showSize: false, showMaterial: false },
  hat: { showColor: false, showSize: false, showMaterial: false },
  apron: { showColor: false, showSize: false, showMaterial: false },
  totebag: { showColor: false, showSize: false, showMaterial: false },
};

function drawBaseProduct(
  canvas: HTMLCanvasElement,
  productName: string,
  colorHex: string,
  size: string,
  material?: string
) {
  const context = canvas.getContext("2d");

  if (!context) return;

  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f5efe6");
  gradient.addColorStop(1, "#ddd7cd");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

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
      context.moveTo(108, 82);
      context.lineTo(212, 82);
      context.lineTo(194, 336);
      context.lineTo(126, 336);
      context.closePath();
      break;
    case "Hat":
      context.beginPath();
      context.ellipse(width / 2, 176, 82, 58, 0, Math.PI, 0, true);
      context.lineTo(242, 182);
      context.quadraticCurveTo(160, 246, 78, 182);
      context.closePath();
      break;
    case "Apron":
      context.beginPath();
      context.moveTo(125, 76);
      context.lineTo(195, 76);
      context.lineTo(226, 128);
      context.lineTo(196, 346);
      context.lineTo(124, 346);
      context.lineTo(94, 128);
      context.closePath();
      break;
    case "Tote bag":
      context.beginPath();
      context.moveTo(98, 132);
      context.lineTo(222, 132);
      context.lineTo(204, 344);
      context.lineTo(116, 344);
      context.closePath();
      context.moveTo(126, 134);
      context.quadraticCurveTo(126, 84, 160, 84);
      context.quadraticCurveTo(194, 84, 194, 134);
      break;
    default:
      context.fillRect(90, 90, 140, 220);
  }

  context.fill();
  context.stroke();

  context.fillStyle = "#1d1d1d";
  context.textAlign = "left";
  context.font = "700 14px Arial";
  context.fillText(`${productName} mockup`, 20, 28);

  if (size) {
    context.font = "500 12px Arial";
    context.fillText(`Size: ${size}`, 20, 48);
  }

  if (material) {
    context.fillText(`Material: ${material}`, 20, 66);
  }
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

function getDesignDimensions(image: HTMLImageElement, scale: number) {
  const maxBaseSize = 110;
  const ratio = Math.min(
    maxBaseSize / image.naturalWidth,
    maxBaseSize / image.naturalHeight
  );

  return {
    width: image.naturalWidth * ratio * scale,
    height: image.naturalHeight * ratio * scale,
  };
}

export function ProductCustomizer({ productType }: ProductCustomizerProps) {
  const product = customProductMap[productType];
  const productOptions = PRODUCT_OPTIONS_CONFIG[productType];
  const { increaseCartQuantity } = useShoppingCart();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const designTransform = useRef({
    x: 150,
    y: 150,
    scale: 1,
    rotationDeg: 0,
  });
  const dragStateRef = useRef({ isDragging: false, offsetX: 0, offsetY: 0 });
  const activeDesignImageRef = useRef<HTMLImageElement | null>(null);

  const [selectedColor, setSelectedColor] = useState(colorOptions[0].label);
  const [selectedSize, setSelectedSize] = useState(AVAILABLE_SIZES[0]);
  const [selectedDesignId, setSelectedDesignId] = useState(AVAILABLE_DESIGNS[0].id);
  const [selectedMaterial, setSelectedMaterial] = useState(AVAILABLE_MATERIALS[0].label);
  const [uploadedDesign, setUploadedDesign] = useState<DesignOption | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [scaleValue, setScaleValue] = useState(1);
  const [rotationValue, setRotationValue] = useState(0);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const availableDesigns = useMemo(
    () => (uploadedDesign ? [...AVAILABLE_DESIGNS, uploadedDesign] : AVAILABLE_DESIGNS),
    [uploadedDesign]
  );

  const activeDesign = useMemo(
    () => availableDesigns.find((design) => design.id === selectedDesignId) ?? availableDesigns[0],
    [availableDesigns, selectedDesignId]
  );

  const selectedColorValue = useMemo(
    () => colorOptions.find((option) => option.label === selectedColor)?.value ?? colorOptions[0].value,
    [selectedColor]
  );

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const designImage = activeDesignImageRef.current;

    if (!canvas) return;

    drawBaseProduct(
      canvas,
      product.name,
      selectedColorValue,
      productOptions.showSize ? selectedSize : "",
      productOptions.showMaterial ? selectedMaterial : undefined
    );

    if (!designImage) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const { x, y, scale, rotationDeg } = designTransform.current;
    const { width, height } = getDesignDimensions(designImage, scale);

    context.save();
    context.translate(x, y);
    context.rotate((rotationDeg * Math.PI) / 180);
    context.drawImage(designImage, -width / 2, -height / 2, width, height);
    context.strokeStyle = "rgba(33, 37, 41, 0.4)";
    context.lineWidth = 1.5;
    context.setLineDash([6, 4]);
    context.strokeRect(-width / 2, -height / 2, width, height);
    context.setLineDash([]);
    context.restore();
  }, [product.name, productOptions.showMaterial, productOptions.showSize, selectedColorValue, selectedMaterial, selectedSize]);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      activeDesignImageRef.current = image;
      redrawCanvas();
    };

    image.src = activeDesign.imageUrl;
  }, [activeDesign.imageUrl, redrawCanvas]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const beginDrag = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const designImage = activeDesignImageRef.current;

    if (!canvas || !designImage) return false;

    const point = getCanvasPoint(canvas, clientX, clientY);
    const { x, y, scale } = designTransform.current;
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
  }, []);

  const updateDrag = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;

    if (!canvas || !dragStateRef.current.isDragging) return;

    const point = getCanvasPoint(canvas, clientX, clientY);
    designTransform.current.x = point.x - dragStateRef.current.offsetX;
    designTransform.current.y = point.y - dragStateRef.current.offsetY;
    redrawCanvas();
  }, [redrawCanvas]);

  const stopDrag = useCallback(() => {
    dragStateRef.current.isDragging = false;
  }, []);

  const resetPosition = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    designTransform.current = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      scale: 1,
      rotationDeg: 0,
    };
    setScaleValue(1);
    setRotationValue(0);
    redrawCanvas();
  }, [redrawCanvas]);

  const handleScaleButton = useCallback((delta: number) => {
    const nextScale = Math.min(
      3,
      Math.max(0.2, Number((designTransform.current.scale + delta).toFixed(2)))
    );

    designTransform.current.scale = nextScale;
    setScaleValue(nextScale);
    redrawCanvas();
  }, [redrawCanvas]);

  const handleScaleSliderChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextScale = Number(event.target.value);

    designTransform.current.scale = nextScale;
    setScaleValue(nextScale);
    redrawCanvas();
  }, [redrawCanvas]);

  const handleRotationChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextRotation = Number(event.target.value);

    designTransform.current.rotationDeg = nextRotation;
    setRotationValue(nextRotation);
    redrawCanvas();
  }, [redrawCanvas]);

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
        throw new Error("Upload failed");
      }

      const data = (await res.json()) as { url: string };
      const customDesign: DesignOption = {
        id: "custom-upload",
        label: "My Design",
        sourceType: "upload",
        imageUrl: data.url,
      };

      setUploadedDesign(customDesign);
      setSelectedDesignId(customDesign.id);
      designTransform.current = {
        x: 160,
        y: 210,
        scale: 1,
        rotationDeg: 0,
      };
      setScaleValue(1);
      setRotationValue(0);
    } catch {
      setUploadError("Upload failed — please try a PNG under 20MB");
      event.target.value = "";
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleAddToCart = useCallback(() => {
    const customization: CartItemCustomization = {
      productType,
      color: productOptions.showColor ? selectedColor : undefined,
      size: productOptions.showSize ? selectedSize : undefined,
      material: productOptions.showMaterial ? selectedMaterial : undefined,
      design: {
        id: activeDesign.id,
        label: activeDesign.label,
        sourceType: activeDesign.sourceType,
        // imageUrl is the permanent reference to the customer's chosen design.
        // At fulfillment, fetch this URL to retrieve the PNG for gang sheet layout.
        imageUrl: activeDesign.imageUrl,
      },
      transform: { ...designTransform.current },
    };

    increaseCartQuantity(
      product.id,
      productOptions.showSize ? selectedSize : "",
      customization
    );
    setSaveMessage("Added to cart");
    window.setTimeout(() => setSaveMessage(null), 2500);
  }, [
    activeDesign.id,
    activeDesign.imageUrl,
    activeDesign.label,
    activeDesign.sourceType,
    increaseCartQuantity,
    product.id,
    productOptions.showColor,
    productOptions.showMaterial,
    productOptions.showSize,
    productType,
    selectedColor,
    selectedMaterial,
    selectedSize,
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
            Build a quick stamp-style preview with color, size, and design selections.
          </p>
        </div>
        <Link to="/" className="btn btn-outline-dark">
          Back to Home
        </Link>
      </div>

      <Row className="g-4">
        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
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
                            boxShadow: isSelected ? "0 0 0 3px #212529" : "0 0 0 1px rgba(0, 0, 0, 0.08)",
                          }}
                        >
                          {isSelected ? (
                            <span
                              style={{
                                color: option.label === "Light Gray" || option.label === "Sand" || option.label === "White" ? "#212529" : "#ffffff",
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

              <Form.Group className="mb-4">
                <Form.Label>Design</Form.Label>
                <div className="d-flex gap-2 overflow-auto pb-1">
                  {availableDesigns.map((design) => {
                    const isSelected = selectedDesignId === design.id;

                    return (
                      <button
                        key={design.id}
                        type="button"
                        onClick={() => setSelectedDesignId(design.id)}
                        className="btn p-2 text-center"
                        style={{
                          minWidth: "104px",
                          borderRadius: "12px",
                          border: isSelected ? "2px solid #212529" : "1px solid #d6d6d6",
                          backgroundColor: "#ffffff",
                          boxShadow: isSelected ? "0 0 0 2px rgba(33, 37, 41, 0.12)" : "none",
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
                        <span className="small fw-semibold d-block">{design.label}</span>
                      </button>
                    );
                  })}
                  {isUploading ? (
                    <div
                      className="d-flex flex-column align-items-center justify-content-center p-2 text-center border rounded-3 bg-white"
                      style={{ minWidth: "104px" }}
                    >
                      <div className="d-flex align-items-center gap-2 small fw-semibold">
                        <Spinner animation="border" size="sm" />
                        Uploading
                      </div>
                    </div>
                  ) : null}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Upload your own design</Form.Label>
                <Form.Control type="file" accept="image/png" onChange={handleUpload} />
                <Form.Text className="text-secondary">
                  PNG only. Uploaded designs stay available while this page remains open.
                </Form.Text>
                {uploadError ? <div className="text-danger small mt-2">{uploadError}</div> : null}
              </Form.Group>

              {productOptions.showMaterial ? (
                <Form.Group className="mb-3">
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

              <div className="pt-2 border-top">
                <p className="small text-secondary mb-2">Current selections</p>
                <div className="d-flex flex-wrap gap-2">
                  {productOptions.showColor ? <Badge bg="dark">{selectedColor}</Badge> : null}
                  {productOptions.showSize ? <Badge bg="secondary">{selectedSize}</Badge> : null}
                  <Badge bg="warning" text="dark">{activeDesign.label}</Badge>
                  {productOptions.showMaterial ? <Badge bg="success">{selectedMaterial}</Badge> : null}
                </div>
              </div>

              {saveMessage ? <Alert variant="success" className="mt-3 mb-0 py-2">{saveMessage}</Alert> : null}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                  <h2 className="h5 fw-bold mb-1">Mockup Preview</h2>
                  <p className="text-secondary mb-0">
                    Drag the design on the canvas to position and rotate it.
                  </p>
                </div>
                <Badge bg="light" text="dark">
                  {product.tagline}
                </Badge>
              </div>

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => handleScaleButton(-0.1)}
                  >
                    Smaller
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => handleScaleButton(0.1)}
                  >
                    Larger
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-link btn-sm text-decoration-none px-0"
                  onClick={resetPosition}
                >
                  Reset position
                </button>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label htmlFor={`${product.slug}-scale`} className="form-label mb-0">Scale</label>
                  <span className="small text-secondary">{Math.round(scaleValue * 100)}%</span>
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
                  width={320}
                  height={420}
                  className="w-100"
                  style={{ maxWidth: "420px", display: "block", margin: "0 auto", touchAction: "none", cursor: "grab" }}
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
              </div>

              <button
                type="button"
                className="btn btn-success btn-lg w-100 mt-3"
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
