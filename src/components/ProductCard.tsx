import { memo } from "react";
import { Rate, Button } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import StockStatusTag from "./StockStatusTag";
import { formatCategoryLabel, formatPrice } from "../utils/format";

interface ProductCardProps {
  product: Product;
  isFavourite: boolean;
  onToggleFavourite: (id: number) => void;
  animationDelayMs?: number;
}

function ProductCard({
  product,
  isFavourite,
  onToggleFavourite,
  animationDelayMs = 0,
}: ProductCardProps) {
  const navigate = useNavigate();
  const goToDetails = () => navigate(`/products/${product.id}`);

  return (
    <div
      className="warm-card"
      style={{ animationDelay: `${animationDelayMs}ms` }}
      role="button"
      tabIndex={0}
      onClick={goToDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          goToDetails();
        }
      }}
      aria-label={`View details for ${product.title}`}
    >
      <div className="warm-card-media">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
        <span className="warm-card-badge">{formatCategoryLabel(product.category)}</span>
      </div>

      <div className="warm-card-body">
        <span className="warm-card-price">{formatPrice(product.price)}</span>
        <div className="warm-card-title" title={product.title}>
          {product.title}
        </div>
        <p className="warm-card-desc">{product.description}</p>

        <div className="warm-card-meta">
          <Rate disabled allowHalf defaultValue={product.rating} style={{ fontSize: 12 }} />
          <StockStatusTag stock={product.stock} />
        </div>

        <div className="warm-card-actions">
          <Button
            icon={isFavourite ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavourite(product.id);
            }}
            aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
          >
            {isFavourite ? "Saved" : "Save"}
          </Button>
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              goToDetails();
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
