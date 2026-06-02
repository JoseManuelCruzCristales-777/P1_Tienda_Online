import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Product, ProductInput } from "./types";
import { seedProducts } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function ensureStore(): Promise<Product[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Invalid catalog file");
    }
    return parsed;
  } catch {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(seedProducts, null, 2), "utf-8");
    return structuredClone(seedProducts);
  }
}

async function persist(products: Product[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export async function listProducts(): Promise<Product[]> {
  return ensureStore();
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await ensureStore();
  return products.find((p) => p.id === id) ?? null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const products = await ensureStore();
  const baseId = slugify(input.title) || "product";
  let id = baseId;
  let suffix = 1;
  while (products.some((p) => p.id === id)) {
    id = `${baseId}-${suffix++}`;
  }

  if (input.layoutRole === "featured") {
    for (const product of products) {
      if (product.layoutRole === "featured") {
        product.layoutRole = "standard";
      }
    }
  }

  const product: Product = { id, ...input };
  products.push(product);
  await persist(products);
  return product;
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product | null> {
  const products = await ensureStore();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  if (input.layoutRole === "featured") {
    for (const product of products) {
      if (product.id !== id && product.layoutRole === "featured") {
        product.layoutRole = "standard";
      }
    }
  }

  const updated: Product = { id, ...input };
  products[index] = updated;
  await persist(products);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await ensureStore();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) return false;
  await persist(next);
  return true;
}
