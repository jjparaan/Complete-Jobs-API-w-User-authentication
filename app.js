import dotenv from "dotenv";
import express from "express";
import expressAsyncErrors from "express-async-errors";
import connectDB from "./db/connectDB.js";
import { notFoundMiddleware } from "./middlewares/not-found.js";
import { errorHandlerMiddleware } from "./middlewares/error-handler.js";
import { authenticationMiddleware } from "./middlewares/authentication.js";
import { userRouter } from "./routes/UserRoute.js";
import { jobRouter } from "./routes/JobRoute.js";

dotenv.config();

const app = express();

// router

// error handlers

// middleware
app.use(express.json());

// routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/jobs", authenticationMiddleware, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
	try {
		// connectDB
		await connectDB(process.env.MONGO_URI);
		app.listen(PORT, () => {
			console.log(`Server running on port: ${PORT}...`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
