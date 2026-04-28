import { createConsumer, createKafkaClient, createProducer } from "@e-commerce-ui/kafka";

const kafkaClient = createKafkaClient("product-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "product-group");