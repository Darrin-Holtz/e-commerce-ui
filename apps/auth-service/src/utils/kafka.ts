import { createKafkaClient, createProducer } from "@e-commerce-ui/kafka";

const kafka = createKafkaClient("email-service");
export const producer = createProducer(kafka);