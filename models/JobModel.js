import mongoose, { Schema } from "mongoose";

const JobSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: "",
		},
		empType: {
			type: String,
			enum: ["full-time", "part-time", "contractual"],
			required: true,
		},
		applicationStatus: {
			type: Boolean,
			default: true,
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

export const Job = mongoose.model("Job", JobSchema);
