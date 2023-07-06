import { Job } from "../models/JobModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/not-found.js";
import { BadRequestError } from "../errors/bad-request.js";
import { UnauthorizedError } from "../errors/unauthorized.js";

export const getJobs = async (req, res) => {
	const jobs = await Job.find({});
	res.status(StatusCodes.OK).json({ jobs });
};

export const addJob = async (req, res) => {
	req.body.createdBy = req.user.userId;
	const job = await Job.create(req.body);
	if (!job) {
		throw new BadRequestError("Oops! Something went wrong");
	}

	if (req.user.empStatus !== "admin") {
		throw new UnauthorizedError(
			"You're not allowed to perform this action. Please contact your administrator"
		);
	}

	res.status(StatusCodes.CREATED).json({ job });
};

export const searchJob = async (req, res) => {
	const { title, empType, applicationStatus, sort, fields } = req.query;
	const queryObject = {};

	if (title) {
		queryObject.title = { $regex: title, $options: "i" };
	}

	if (empType) {
		queryObject.empType = { $regex: empType, $options: "i" };
	}

	if (applicationStatus) {
		queryObject.applicationStatus = applicationStatus === "true" ? true : false;
	}

	let result = Job.find(queryObject);

	if (sort) {
		const sortList = sort.split(",").join(" ");
		result = result.sort(sortList);
	}

	if (fields) {
		const fieldList = fields.split(",").join(" ");
		result = result.select(fieldList);
	}

	const jobs = await result;
	res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

export const getJob = async (req, res) => {
	const { id: jobID } = req.params;
	const job = await Job.findOne({ _id: jobID });
	if (!job) {
		throw new NotFoundError(
			"We don't have opening/s for the job that you're looking for"
		);
	}

	res.status(StatusCodes.OK).json({ job });
};

export const updateJob = async (req, res) => {
	const { id: jobID } = req.params;
	const job = await Job.findOneAndUpdate({ _id: jobID }, req.body, {
		new: true,
		runValidators: true,
	});
	if (!job) {
		throw new NotFoundError("You can't update a job that doesn't exist");
	}

	if (req.user.empStatus !== "admin") {
		throw new UnauthorizedError(
			"You're not allowed to perform this action. Please contact your administrator"
		);
	}

	res.status(StatusCodes.OK).json({ job });
};

export const deleteJob = async (req, res) => {
	const { id: jobID } = req.params;
	const job = await Job.findOneAndDelete({ _id: jobID });
	if (!job) {
		throw new NotFoundError("This job is already non-existent");
	}

	if (req.user.empStatus !== "admin") {
		throw new UnauthorizedError(
			"You're not allowed to perform this action. Please contact your administrator"
		);
	}

	res
		.status(StatusCodes.OK)
		.json({ msg: `Job id: ${jobID} have been removed successfully` });
};
