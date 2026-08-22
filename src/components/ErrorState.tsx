import { Button, Result } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  message = "Something went wrong while loading products.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Result
      status="error"
      title="Failed to load"
      subTitle={message}
      extra={
        <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
          Retry
        </Button>
      }
    />
  );
}
