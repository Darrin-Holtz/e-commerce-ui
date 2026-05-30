import { Kafka } from "kafkajs";

export const createKafkaClient = (service: string) => {
  const brokers = process.env.KAFKA_BROKERS
    ? process.env.KAFKA_BROKERS.split(",")
    : ["localhost:9094", "localhost:9095", "localhost:9096"];

  const sasl =
    process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD
      ? {
          mechanism: "scram-sha-256" as const,
          username: process.env.KAFKA_USERNAME,
          password: process.env.KAFKA_PASSWORD,
        }
      : undefined;

  return new Kafka({
    clientId: service,
    brokers,
    ssl: sasl ? true : undefined,
    sasl,
  });
};