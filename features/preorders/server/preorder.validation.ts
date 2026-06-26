import type { PreorderPayload } from "@/features/preorders/preorder.types";

export function validatePreorderPayload(payload: Partial<PreorderPayload>) {
  const products = payload.products;

  if (!payload.name?.trim()) {
    return "Name is required.";
  }

  if (!Number.isInteger(products) || products === undefined || products < 1) {
    return "Products must be at least 1.";
  }

  if (!payload.preorderWhen?.trim()) {
    return "Preorder timing is required.";
  }

  if (!payload.startsAt || Number.isNaN(Date.parse(payload.startsAt))) {
    return "Start date is required.";
  }

  if (payload.endsAt && Number.isNaN(Date.parse(payload.endsAt))) {
    return "End date must be valid.";
  }

  if (typeof payload.isActive !== "boolean") {
    return "Status is required.";
  }

  return null;
}
