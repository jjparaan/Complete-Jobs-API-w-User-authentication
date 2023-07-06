import { User } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/unauthorized.js";

export const authenticationMiddleware = async (req, res, next) => {
	// check header
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new UnauthorizedError("Unauthorized user can't access this route");
	}
	const token = authHeader.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = {
			userId: payload.userId,
			firstName: payload.firstName,
			lastName: payload.lastName,
			empStatus: payload.empStatus,
		};
		next();
	} catch (error) {
		throw new UnauthorizedError(
			`Authentication failed. Please check: ${error}`
		);
	}
};
