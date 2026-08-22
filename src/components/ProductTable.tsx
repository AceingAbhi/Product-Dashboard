import { memo } from "react";
import { Table, Image, Rate, Button, Tag, Tooltip } from "antd";
import { HeartOutlined, HeartFilled, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import StockStatusTag from "./StockStatusTag";
import { formatCategoryLabel, formatPrice } from "../utils/format";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  favouriteIds: number[];
  onToggleFavourite: (id: number) => void;
}

function ProductTable({
  products,
  loading,
  favouriteIds,
  onToggleFavourite,
}: ProductTableProps) {
  const navigate = useNavigate();

  const columns: ColumnsType<Product> = [
    {
      title: "Image",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 80,
      render: (thumbnail: string, record) => (
        <Image
          src={thumbnail}
          alt={record.title}
          width={48}
          height={48}
          style={{ objectFit: "cover", borderRadius: 6 }}
          loading="lazy"
          preview={false}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
      render: (title: string, record) => (
        <a onClick={() => navigate(`/products/${record.id}`)}>{title}</a>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => <Tag>{formatCategoryLabel(category)}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => formatPrice(price),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => <StockStatusTag stock={stock} />,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      sorter: (a, b) => a.rating - b.rating,
      render: (rating: number) => (
        <Rate disabled allowHalf defaultValue={rating} style={{ fontSize: 14 }} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => {
        const isFavourite = favouriteIds.includes(record.id);
        return (
          <div style={{ display: "flex", gap: 8 }}>
            <Tooltip title="View Details">
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/products/${record.id}`)}
                aria-label={`View details for ${record.title}`}
              />
            </Tooltip>
            <Tooltip title={isFavourite ? "Remove favourite" : "Add favourite"}>
              <Button
                size="small"
                icon={isFavourite ? <HeartFilled /> : <HeartOutlined />}
                danger={isFavourite}
                onClick={() => onToggleFavourite(record.id)}
                aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      className="warm-table"
      rowKey="id"
      columns={columns}
      dataSource={products}
      loading={loading}
      pagination={false}
      scroll={{ x: 700 }}
      locale={{ emptyText: "No products match your filters." }}
    />
  );
}

// Memoised — the parent re-renders on every keystroke debounce tick, but the
// table itself only needs to re-render when the actual data/loading/favourites change.
export default memo(ProductTable);
