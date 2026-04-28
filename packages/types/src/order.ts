import { OrderSchemaType } from "@e-commerce-ui/order-db";

export type OrderType = OrderSchemaType & {
  _id: string;
};

export type OrderChartType = {
  month: string;
  total: number;
  successful: number;
};