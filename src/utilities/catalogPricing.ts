export function getCustomProductUnitPrice(productType: string, size?: string) {
  switch (productType) {
    case "tshirt":
      if (size === "XXL") return 20;
      if (size === "XXXL") return 22;
      return 17;
    case "sweater":
      if (size === "XXL") return 30;
      if (size === "XXXL") return 35;
      return 25;
    case "hoodie":
      if (size === "XXL") return 34;
      if (size === "XXXL") return 40;
      return 28;
    case "totebag":
      return 15;
    case "apron":
      return 18;
    case "glasscup":
      return 18;
    case "hat":
      return 25;
    default:
      return 0;
  }
}
