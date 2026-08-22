import { Tag } from "antd";
import { getStockStatus, stockStatusColor, stockStatusLabel } from "../utils/format";

interface StockStatusTagProps {
  stock: number;
}

export default function StockStatusTag({ stock }: StockStatusTagProps) {
  const status = getStockStatus(stock);
  return <Tag color={stockStatusColor(status)}>{stockStatusLabel(status)}</Tag>;
}
