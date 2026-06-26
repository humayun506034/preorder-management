import type { Preorder } from "@/features/preorders/preorder.types";

type PrismaPreorder = {
  id: string;
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: Date;
  endsAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function toPreorder(preorder: PrismaPreorder): Preorder {
  return {
    ...preorder,
    startsAt: preorder.startsAt.toISOString(),
    endsAt: preorder.endsAt?.toISOString() ?? null,
    createdAt: preorder.createdAt.toISOString(),
    updatedAt: preorder.updatedAt.toISOString(),
  };
}
