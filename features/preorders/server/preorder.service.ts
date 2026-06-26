import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Prisma } from "@/lib/generated/prisma/client";
import { ensureDatabase, getPrisma } from "@/lib/server/prisma";
import type { Preorder, PreorderPayload } from "@/features/preorders/preorder.types";
import {
  DEFAULT_PREORDER_LIMIT,
  DEFAULT_PREORDER_PAGE,
} from "@/features/preorders/server/preorder.constants";
import { PreorderNotFoundError } from "@/features/preorders/server/preorder.errors";
import { toPreorder } from "@/features/preorders/server/preorder.mapper";
import type { FindPreordersQuery } from "@/features/preorders/server/preorder.query";
import { validatePreorderPayload } from "@/features/preorders/server/preorder.validation";

export { PreorderNotFoundError } from "@/features/preorders/server/preorder.errors";
export { parseFindPreordersQuery } from "@/features/preorders/server/preorder.query";

export type FindPreordersResult = {
  data: Preorder[];
  meta: {
    page: number;
    limit: number;
    itemCount: number;
    totalItems: number;
    totalPages: number;
    from: number;
    to: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

type SeedPreorder = {
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
};

export async function createPreorder(payload: Partial<PreorderPayload>) {
  const validationError = validatePreorderPayload(payload);

  if (validationError) {
    throw new Error(validationError);
  }

  await ensureDatabase();
  const prisma = getPrisma();
  const preorder = await prisma.preorder.create({
    data: {
      name: payload.name!.trim(),
      products: payload.products!,
      preorderWhen: payload.preorderWhen!.trim(),
      startsAt: new Date(payload.startsAt!),
      endsAt: payload.endsAt ? new Date(payload.endsAt) : null,
      isActive: payload.isActive!,
    },
  });

  return toPreorder(preorder);
}

export async function findPreorders(
  query: FindPreordersQuery,
): Promise<FindPreordersResult> {
  await ensureDatabase();

  const prisma = getPrisma();
  const page = query.page ?? DEFAULT_PREORDER_PAGE;
  const limit = query.limit ?? DEFAULT_PREORDER_LIMIT;
  const status = query.status ?? "all";
  const sortBy = query.sortBy ?? "createdAt";
  const sortOrder = query.sortOrder ?? "desc";
  const search = query.search?.trim();

  const where: Prisma.PreorderWhereInput = {
    ...(status === "all" ? {} : { isActive: status === "active" }),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { preorderWhen: { contains: search } },
          ],
        }
      : {}),
  };

  const [data, totalItems] = await Promise.all([
    prisma.preorder.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.preorder.count({ where }),
  ]);

  const itemCount = data.length;
  const totalPages = Math.ceil(totalItems / limit);
  const from = itemCount === 0 ? 0 : (page - 1) * limit + 1;
  const to = from === 0 ? 0 : from + itemCount - 1;

  return {
    data: data.map(toPreorder),
    meta: {
      page,
      limit,
      itemCount,
      totalItems,
      totalPages,
      from,
      to,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function findPreorder(id: string) {
  await ensureDatabase();

  const prisma = getPrisma();
  const preorder = await prisma.preorder.findUnique({
    where: { id },
  });

  if (!preorder) {
    throw new PreorderNotFoundError();
  }

  return toPreorder(preorder);
}

export async function updatePreorder(
  id: string,
  payload: Partial<PreorderPayload>,
) {
  await findPreorder(id);

  const validationError = validatePreorderPayload(payload);

  if (validationError) {
    throw new Error(validationError);
  }

  const prisma = getPrisma();
  const preorder = await prisma.preorder.update({
    where: { id },
    data: {
      name: payload.name!.trim(),
      products: payload.products!,
      preorderWhen: payload.preorderWhen!.trim(),
      startsAt: new Date(payload.startsAt!),
      endsAt: payload.endsAt ? new Date(payload.endsAt) : null,
      isActive: payload.isActive!,
    },
  });

  return toPreorder(preorder);
}

export async function deletePreorder(id: string) {
  await findPreorder(id);

  const prisma = getPrisma();
  const preorder = await prisma.preorder.delete({
    where: { id },
  });

  return toPreorder(preorder);
}

export async function seedPreorders() {
  await ensureDatabase();

  const prisma = getPrisma();
  const filePath = resolve(process.cwd(), "prisma/seed-data/preorders.json");
  const preorders = JSON.parse(
    readFileSync(filePath, "utf8"),
  ) as SeedPreorder[];

  const result = await prisma.preorder.createMany({
    data: preorders.map((preorder) => ({
      name: preorder.name,
      products: preorder.products,
      preorderWhen: preorder.preorderWhen,
      startsAt: new Date(preorder.startsAt),
      endsAt: preorder.endsAt ? new Date(preorder.endsAt) : null,
      isActive: preorder.isActive,
    })),
  });

  return {
    inserted: result.count,
  };
}
