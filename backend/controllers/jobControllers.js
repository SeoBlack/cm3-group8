const Job = require("../models/jobModel");
const mongoose = require("mongoose");

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
const createJob = async (req, res) => {
  console.log(req.body);
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
    !contactPhone
  ) {
    return res.status(400).json({ error: " fields are missing" });
  }
  try {
    const job = await Job.create({
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
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /jobs/:jobId
const getJobById = async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) {
    return res.status(400).json({ error: "Job ID is required" });
  }
  try {
    const job = await Job.findById(jobId);
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    !contactPhone
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
