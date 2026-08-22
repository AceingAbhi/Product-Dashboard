import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Rate, Tag, Typography, Row, Col, Image, Skeleton, Space, App as AntApp } from "antd";
import { ArrowLeftOutlined, HeartFilled, HeartOutlined, EditOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { useGetProductByIdQuery } from "../services/productsApi";
import { toggleFavourite, updateProduct } from "../store/productsSlice";
import StockStatusTag from "../components/StockStatusTag";
import ErrorState from "../components/ErrorState";
import EditProductModal from "../components/EditProductModal";
import { formatCategoryLabel, formatPrice } from "../utils/format";
import type { Product } from "../types/product";

const { Title, Paragraph, Text } = Typography;

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = AntApp.useApp();
  const productId = Number(id);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const locallyAddedProducts = useAppSelector(
    (state) => state.products.locallyAddedProducts
  );
  const favouriteIds = useAppSelector((state) => state.products.favouriteIds);
  const productOverrides = useAppSelector((state) => state.products.productOverrides);

  // Locally-added products are never persisted server-side, so if the id
  // belongs to one of them we use that copy directly and skip the API call.
  const localProduct = locallyAddedProducts.find((p) => p.id === productId);

  const {
    data: fetchedProduct,
    isLoading,
    isError,
    refetch,
  } = useGetProductByIdQuery(productId, { skip: !!localProduct || !productId });

  // Session-local edits take priority over both the local-added copy and
  // the API-fetched one, since DummyJSON doesn't persist PUT requests.
  const product = productOverrides[productId] ?? localProduct ?? fetchedProduct;
  const isFavourite = product ? favouriteIds.includes(product.id) : false;

  const handleFavouriteToggle = () => {
    if (!product) return;
    dispatch(toggleFavourite(product.id));
    message.success(isFavourite ? "Removed from favourites" : "Added to favourites");
  };

  const handleEditSuccess = (updated: Product) => {
    dispatch(updateProduct(updated));
  };

  const backButton = (
    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/")}>
      Back to Products
    </Button>
  );

  if (isLoading) {
    return (
      <div>
        {backButton}
        <Skeleton active avatar paragraph={{ rows: 6 }} style={{ marginTop: 24 }} />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div>
        {backButton}
        <ErrorState message="Could not load this product." onRetry={refetch} />
      </div>
    );
  }

  const discountedPrice =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : null;

  return (
    <div>
      {backButton}
      <Row gutter={[32, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={10}>
          <Image
            src={product.thumbnail}
            alt={product.title}
            style={{ width: "100%", borderRadius: 8, objectFit: "cover" }}
          />
        </Col>
        <Col xs={24} md={14}>
          <Title level={2} style={{ marginBottom: 4, fontFamily: "var(--font-display)" }}>
            {product.title}
          </Title>
          <Space style={{ marginBottom: 12 }}>
            <Tag>{formatCategoryLabel(product.category)}</Tag>
            <Text type="secondary">{product.brand}</Text>
          </Space>

          <Rate disabled allowHalf defaultValue={product.rating ?? 0} />
          <Text style={{ marginLeft: 8 }}>({(product.rating ?? 0).toFixed(2)})</Text>

          <Paragraph style={{ marginTop: 16 }}>{product.description}</Paragraph>

          <Space size="large" style={{ marginBottom: 16 }} wrap>
            <div>
              {discountedPrice ? (
                <>
                  <Text delete type="secondary" style={{ marginRight: 8 }}>
                    {formatPrice(product.price)}
                  </Text>
                  <Text strong style={{ fontSize: 20 }}>
                    {formatPrice(discountedPrice)}
                  </Text>
                  <Tag color="volcano" style={{ marginLeft: 8 }}>
                    -{product.discountPercentage.toFixed(0)}%
                  </Tag>
                </>
              ) : (
                <Text strong style={{ fontSize: 20 }}>
                  {formatPrice(product.price)}
                </Text>
              )}
            </div>
            <StockStatusTag stock={product.stock} />
          </Space>

          <Space>
            <Button
              icon={isFavourite ? <HeartFilled /> : <HeartOutlined />}
              danger={isFavourite}
              onClick={handleFavouriteToggle}
            >
              {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
            </Button>
            <Button icon={<EditOutlined />} onClick={() => setEditModalOpen(true)}>
              Edit Product
            </Button>
          </Space>
        </Col>
      </Row>

      <EditProductModal
        open={editModalOpen}
        product={product}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
