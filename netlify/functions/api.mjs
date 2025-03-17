import express from "express";
import mongoose from "mongoose";
import mongoSanitize from "express-mongo-sanitize";
import "dotenv/config";
import serverless from "serverless-http";
import cors from "cors";

import logger from "../../middleware/logger.js";
import errorHandler from "../../middleware/errorHandler.js";

import userController from "../../controllers/userController.js";
import movieController from "../../controllers/movieController.js";
import reviewController from "../../controllers/reviewController.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON body type, adding them to the req.body
app.use(mongoSanitize()); // Prevents code injections
app.use(logger); // Logs key information on incoming requests

// Routes
app.use("/", userController);
app.use("/", movieController);
app.use("/", reviewController);
app.use(errorHandler);

// Database connection
let isConnected = false;

const establishServerConnections = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("🤖 Database connected");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    throw error; // Ensure the error is propagated
  }
};

// Wrap the serverless handler to ensure the database is connected
const handler = async (event, context) => {
  try {
    await establishServerConnections(); // Ensure DB connection before handling the request
    return serverless(app)(event, context);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

export { handler }