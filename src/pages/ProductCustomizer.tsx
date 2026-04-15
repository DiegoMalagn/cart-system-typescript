import { useEffect, useMemo, useRef, useState } from "react";
import { Badge, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  customProductMap,
  type CustomProductSlug,
} from "../data/customProducts";

type ProductCustomizerProps = {
  productType: CustomProductSlug;
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

const designOptions = [
  "Classic Stamp",
  // for future: "Vintage Seal","Bold Ink","Minimalist Mark","Distressed Print",
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

function drawPreview(
  canvas: HTMLCanvasElement,
  productName: string,
  colorHex: string,
  designName: string,
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

  context.fillStyle = "rgba(255, 255, 255, 0.86)";
  context.fillRect(102, 166, 116, 82);

  context.strokeStyle = "rgba(29, 29, 29, 0.5)";
  context.setLineDash([7, 5]);
  context.strokeRect(102, 166, 116, 82);
  context.setLineDash([]);

  context.fillStyle = "#1d1d1d";
  context.textAlign = "center";
  context.font = "700 18px Arial";
  context.fillText(designName, width / 2, 198, 96);
  context.font = "500 12px Arial";
  context.fillText(size, width / 2, 222);

  if (material) {
    context.fillText(material, width / 2, 240, 96);
  }

  context.textAlign = "left";
  context.font = "700 14px Arial";
  context.fillText(`${productName} mockup`, 20, 28);
}

export function ProductCustomizer({ productType }: ProductCustomizerProps) {
  const product = customProductMap[productType];
  const productOptions = PRODUCT_OPTIONS_CONFIG[productType];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [selectedColor, setSelectedColor] = useState(colorOptions[0].label);
  const [selectedSize, setSelectedSize] = useState(AVAILABLE_SIZES[0]);
  const [selectedDesign, setSelectedDesign] = useState(designOptions[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(AVAILABLE_MATERIALS[0].label);

  const selectedColorValue = useMemo(
    () => colorOptions.find((option) => option.label === selectedColor)?.value ?? colorOptions[0].value,
    [selectedColor]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawPreview(
      canvas,
      product.name,
      selectedColorValue,
      selectedDesign,
      selectedSize,
      productOptions.showMaterial ? selectedMaterial : undefined
    );
  }, [product.name, productOptions.showMaterial, selectedColorValue, selectedDesign, selectedMaterial, selectedSize]);

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

              <Form.Group className="mb-3">
                <Form.Label>Design</Form.Label>
                <Form.Select value={selectedDesign} onChange={(event) => setSelectedDesign(event.target.value)}>
                  {designOptions.map((design) => (
                    <option key={design} value={design}>
                      {design}
                    </option>
                  ))}
                </Form.Select>
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
                  <Badge bg="warning" text="dark">{selectedDesign}</Badge>
                  {productOptions.showMaterial ? <Badge bg="success">{selectedMaterial}</Badge> : null}
                </div>
              </div>
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
                    Canvas preview updates live as you change options.
                  </p>
                </div>
                <Badge bg="light" text="dark">
                  {product.tagline}
                </Badge>
              </div>

              <div className="customizer-canvas-shell">
                <canvas
                  ref={canvasRef}
                  width={320}
                  height={420}
                  className="w-100"
                  style={{ maxWidth: "420px", display: "block", margin: "0 auto" }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
