import { CustomAPIErrors } from "../errors/custom-api.js";
import { StatusCodes } from "http-status-codes";

export const errorHandlerMiddleware = async (err, req, res, next) => {
	if (err instanceof CustomAPIErrors) {
		return res.status(err.statusCode).json({ msg: err.message });
	}
	res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};
