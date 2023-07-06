import { User } from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/bad-request.js";
import { UnauthorizedError } from "../errors/unauthorized.js";

export const register = async (req, res) => {
	const user = await User.create({ ...req.body });
	const token = await user.createJWT();
	res.status(StatusCodes.CREATED).json({
		user: {
			firstName: user.firstName,
			lastName: user.lastName,
			empStatus: user.empStatus,
		},
		token,
	});
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequestError("Please provide an email and password");
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new UnauthorizedError("User does not exist");
	}

	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new UnauthorizedError("Invalid credentials");
	}

	const token = user.createJWT();
	res.status(StatusCodes.CREATED).json({
		user: {
			firstName: user.firstName,
			lastName: user.lastName,
			empStatus: user.empStatus,
		},
		token,
	});
};
