import { createConsumer, createKafkaClient, createProducer } from "@e-commerce-ui/kafka";

const kafkaClient = createKafkaClient("payment-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "payment-group");