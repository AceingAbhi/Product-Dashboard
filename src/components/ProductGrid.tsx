import { memo } from "react";
import { Skeleton } from "antd";
import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  favouriteIds: number[];
  onToggleFavourite: (id: number) => void;
}

// Cap the stagger so long lists don't feel sluggish to load.
const MAX_STAGGER_ITEMS = 12;
const STAGGER_STEP_MS = 45;

function ProductGrid({
  products,
  loading,
  favouriteIds,
  onToggleFavourite,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="product-card-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="warm-card" style={{ animation: "none" }}>
            <Skeleton.Image active style={{ width: "100%", height: 160 }} />
            <div style={{ padding: 16 }}>
              <Skeleton active title paragraph={{ rows: 2 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="product-card-grid">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavourite={favouriteIds.includes(product.id)}
          onToggleFavourite={onToggleFavourite}
          animationDelayMs={Math.min(index, MAX_STAGGER_ITEMS) * STAGGER_STEP_MS}
        />
      ))}
    </div>
  );
}

export default memo(ProductGrid);
