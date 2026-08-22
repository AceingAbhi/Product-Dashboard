import { Modal, Form, Input, InputNumber, Rate, Button, Row, Col, App as AntApp } from "antd";
import type { NewProductPayload, Product } from "../types/product";
import { useAddProductMutation } from "../services/productsApi";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (product: Product) => void;
}

// Fields collected by the form; price/stock are numbers, everything else text.
type FormValues = NewProductPayload;

export default function AddProductModal({
  open,
  onClose,
  onSuccess,
}: AddProductModalProps) {
  const [form] = Form.useForm<FormValues>();
  const [addProduct, { isLoading }] = useAddProductMutation();
  const { message } = AntApp.useApp();

  const handleFinish = async (values: FormValues) => {
    try {
      // DummyJSON's /products/add is a simulated endpoint: it validates the
      // request shape and echoes back a product with a generated id, but
      // does not persist it server-side — matching the assignment's
      // "may be added locally" requirement.
      const created = await addProduct(values).unwrap();
      message.success(`"${created.title}" was added successfully.`);
      onSuccess(created);
      form.resetFields();
      onClose();
    } catch (err) {
      message.error("Failed to add product. Please try again.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Add Product"
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
      width={640}
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark="optional"
      >
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
              initialValue={0}
              rules={[{ required: true, message: "Rating is required." }]}
            >
              <Rate allowHalf />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
