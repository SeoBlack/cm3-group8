const Job = require("../models/jobModel");
const mongoose = require("mongoose");
const { validateJobData } = require("../utils/lib");
//GET / jobs;

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /jobs
// Optimized createJob
const createJob = async (req, res) => {
  const validation = validateJobData(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const job = await Job.create({
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      company: {
        name: req.body.companyName,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone,
        website: req.body.website,
        size: req.body.size,
      },
      location: req.body.location,
      salary: req.body.salary,
      experienceLevel: req.body.experienceLevel,
      postedDate: req.body.postedDate,
      status: req.body.status,
      applicationDeadline: req.body.applicationDeadline,
      requirements: req.body.requirements,
    });
    res.status(201).json(job);
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ error: "Failed to create job" });
  }
};

// GET /jobs/:jobId
const getJobById = async (req, res) => {
  const { jobId } = req.params;

  // Validate ObjectId format
  if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ error: "Invalid job ID format" });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /jobs/:jobId
const updateJob = async (req, res) => {
  const { jobId } = req.params;
  const {
    title,
    type,
    description,
    companyName,
    contactEmail,
    contactPhone,
    website,
    size,
    location,
    salary,
    experienceLevel,
    postedDate,
    status,
    applicationDeadline,
    requirements,
  } = req.body;
  if (
    !title ||
    !type ||
    !description ||
    !companyName ||
    !contactEmail ||
    !contactPhone ||
    !salary ||
    !location
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const job = await Job.findByIdAndUpdate(
      jobId,
      {
        title,
        type,
        description,
        company: {
          name: companyName,
          contactEmail: contactEmail,
          contactPhone: contactPhone,
          website: website,
          size: size,
        },
        location,
        salary,
        experienceLevel,
        postedDate,
        status,
        applicationDeadline,
        requirements,
      },
      { new: true }
    );
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /jobs/:jobId

const deleteJob = async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) {
    return res.status(400).json({ error: "Job ID is required" });
  }
  try {
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
