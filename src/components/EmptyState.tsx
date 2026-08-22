import { Empty, Button } from "antd";

interface EmptyStateProps {
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  description = "No products found.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Empty description={description} style={{ padding: "48px 0" }}>
      {actionLabel && onAction && (
        <Button type="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Empty>
  );
}
