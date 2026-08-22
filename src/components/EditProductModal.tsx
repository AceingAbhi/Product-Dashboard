import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Rate, Button, Row, Col, App as AntApp } from "antd";
import type { NewProductPayload, Product } from "../types/product";
import { useUpdateProductMutation } from "../services/productsApi";

interface EditProductModalProps {
  open: boolean;
  product: Product;
  onClose: () => void;
  onSuccess: (product: Product) => void;
}

type FormValues = NewProductPayload;

export default function EditProductModal({
  open,
  product,
  onClose,
  onSuccess,
}: EditProductModalProps) {
  const [form] = Form.useForm<FormValues>();
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const { message } = AntApp.useApp();

  // Re-seed the form whenever a different product is opened for editing.
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        brand: product.brand,
        thumbnail: product.thumbnail,
        rating: product.rating,
      });
    }
  }, [open, product, form]);

  const handleFinish = async (values: FormValues) => {
    try {
      // DummyJSON's PUT /products/:id is simulated the same way as
      // POST /products/add: it echoes back the updated product but does
      // not persist it server-side.
      const updated = await updateProduct({ id: product.id, body: values }).unwrap();
      message.success(`"${updated.title}" was updated successfully.`);
      onSuccess({ ...updated, id: product.id });
      onClose();
    } catch {
      message.error("Failed to update product. Please try again.");
    }
  };

  return (
    <Modal
      title="Edit Product"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={640}
    >
      <Form<FormValues> form={form} layout="vertical" onFinish={handleFinish} requiredMark="optional">
        <Form.Item
          label="Product Name"
          name="title"
          rules={[{ required: true, message: "Product name is required." }]}
        >
          <Input placeholder="e.g. Wireless Mouse" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description is required." }]}
        >
          <Input.TextArea rows={3} placeholder="Short product description" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Category is required." }]}
            >
              <Input placeholder="e.g. electronics" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Brand"
              name="brand"
              rules={[{ required: true, message: "Brand is required." }]}
            >
              <Input placeholder="e.g. Logitech" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Price (USD)"
              name="price"
              rules={[{ required: true, message: "Price is required." }]}
            >
              <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Stock Quantity"
              name="stock"
              rules={[{ required: true, message: "Stock quantity is required." }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              label="Product Image URL"
              name="thumbnail"
              rules={[
                { required: true, message: "Image URL is required." },
                { type: "url", message: "Enter a valid URL." },
              ]}
            >
              <Input placeholder="https://..." />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: "Rating is required." }]}
            >
              <Rate allowHalf />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
