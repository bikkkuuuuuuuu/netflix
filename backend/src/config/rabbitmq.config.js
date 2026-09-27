const RabbitMq = require("@bikashpandey90/rabbitmq");
const sendEmail = require("../modules/auth/email.service");
const rabbitMq = new RabbitMq({
  url: process.env.RABBITMQ_URL,
  serviceName: "Email Service",
  queues: ["email_created"],
});
const publishToQueue = async (queue, message) => {
  try {
    await rabbitMq.publish(queue, message);
  } catch (error) {
    console.error(`Failed to publish to ${queue}:`, error);
    throw error;
  }
};
const consumeFromQueue = async () => {
  try {
    await rabbitMq.consume(
      "email_created",
      async (event) => {
        try {
          await sendEmail(event.name, event.otp, event.email);
          console.log("Email sent successfully");
        } catch (error) {
          console.error("Failed to send email:", error);
          throw error;
        }
      },
      { noAck: false },
    );
  } catch (error) {
    console.error("Failed to start RabbitMQ consumer:", error);
    throw error;
  }
};
const connectRabbitMq = async () => {
  await rabbitMq.connect();
  console.log("RabbitMQ connected");
};

const closeRabbitMq = async () => {
  await rabbitMq.close();
  console.log("RabbitMQ connection closed");
};

module.exports = {
  publishToQueue,
  connectRabbitMq,
  closeRabbitMq,
  consumeFromQueue,
};
