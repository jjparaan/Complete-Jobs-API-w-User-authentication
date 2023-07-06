import express from "express";
import {
	getJobs,
	addJob,
	searchJob,
	getJob,
	updateJob,
	deleteJob,
} from "../controllers/JobController.js";

export const jobRouter = express.Router();

jobRouter.route("/").get(getJobs).post(addJob);
jobRouter.route("/search").get(searchJob);
jobRouter.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);
