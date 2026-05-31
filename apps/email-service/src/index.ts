import http from "http";
import sendMail from "./utils/mailer.js";
import { createConsumer, createKafkaClient } from "@e-commerce-ui/kafka";

const kafka = createKafkaClient("email-service");
const consumer = createConsumer(kafka, "email-service");

const start = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe([
      {
        topicName: "user.created",
        topicHandler: async (message) => {
          const { email, username } = message.value;

          if (email) {
            await sendMail({
              email,
              subject: "Welcome to E-commerce App",
              text: `Welcome ${username}. You account has been created!`,
            });
          }
        },
      },
      {
        topicName: "order.created",
        topicHandler: async (message) => {
          const { email, amount, status } = message.value;

          if (email) {
            await sendMail({
              email,
              subject: "Order has been created",
              text: `Hello! Your order: Amount: ${amount/100}, Status: ${status}`,
            });
          }
        },
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};

const port = parseInt(process.env.PORT || "8004", 10);
http.createServer((_, res) => {
  res.writeHead(200);
  res.end("ok");
}).listen(port, "0.0.0.0", () => {
  console.log(`Email service health check on port ${port}`);
});

start();