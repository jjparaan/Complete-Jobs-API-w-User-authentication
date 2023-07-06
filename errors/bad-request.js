import { CustomAPIErrors } from "./custom-api.js";
import { StatusCodes } from "http-status-codes";

export class BadRequestError extends CustomAPIErrors {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}
