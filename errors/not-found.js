import { CustomAPIErrors } from "./custom-api.js";
import { StatusCodes } from "http-status-codes";

export class NotFoundError extends CustomAPIErrors {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.NOT_FOUND;
	}
}
