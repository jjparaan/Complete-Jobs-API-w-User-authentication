import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			maxlength: 20,
		},
		empStatus: {
			type: String,
			enum: {
				values: [
					"pending",
					"accepted",
					"rejected",
					"admin",
					"staff",
					"terminated",
				],
				message: "{VALUE} is not supported",
			},
			required: true,
		},
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UserSchema.methods.createJWT = function () {
	return jwt.sign(
		{
			userId: this._id,
			firstName: this.firstName,
			lastName: this.lastName,
			empStatus: this.empStatus,
		},
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_LIFETIME }
	);
};

UserSchema.methods.comparePassword = async function (inputPassword) {
	const isMatch = await bcrypt.compare(inputPassword, this.password);
	return isMatch;
};

export const User = mongoose.model("User", UserSchema);
