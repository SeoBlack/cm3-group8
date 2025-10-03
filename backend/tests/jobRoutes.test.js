const request = require("supertest");
const app = require("../app");
const Job = require("../models/jobModel");

describe("Job API Routes", () => {
  // Test data
  const validJobData = {
    title: "Software Engineer",
    type: "Full-time",
    description: "A great opportunity to work on cutting-edge technology",
    companyName: "Tech Corp",
    contactEmail: "hr@techcorp.com",
    contactPhone: "+1-555-0123",
    website: "https://techcorp.com",
    size: 100,
    location: "San Francisco, CA",
    salary: 120000,
    experienceLevel: "Mid",
    status: "open",
    applicationDeadline: "2024-12-31",
    requirements: ["JavaScript", "React", "Node.js"],
  };

  const invalidJobData = {
    title: "Software Engineer",
    // Missing required fields: type, description, companyName, contactEmail, contactPhone
  };

  describe("GET /api/jobs", () => {
    //should return all jobs
    it("should return all jobs", async () => {
      //create a job
      const createdJob = await Job.create({
        title: validJobData.title,
        type: validJobData.type,
        description: validJobData.description,
        company: {
          name: validJobData.companyName,
          contactEmail: validJobData.contactEmail,
          contactPhone: validJobData.contactPhone,
          website: validJobData.website,
          size: validJobData.size,
        },
        location: validJobData.location,
        salary: validJobData.salary,
        experienceLevel: validJobData.experienceLevel,
        status: validJobData.status,
        applicationDeadline: validJobData.applicationDeadline,
        requirements: validJobData.requirements,
      });

      const response = await request(app).get("/api/jobs").expect(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0].title).toBe(validJobData.title);
      expect(response.body[0].type).toBe(validJobData.type);
      expect(response.body[0].description).toBe(validJobData.description);
    });
  });

  describe("POST /api/jobs", () => {
    it("should create a new job with valid data", async () => {
      const response = await request(app)
        .post("/api/jobs")
        .send(validJobData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe(validJobData.title);
      expect(response.body.type).toBe(validJobData.type);
      expect(response.body.description).toBe(validJobData.description);
      expect(response.body.company.name).toBe(validJobData.companyName);
      expect(response.body.company.contactEmail).toBe(
        validJobData.contactEmail
      );
      expect(response.body.company.contactPhone).toBe(
        validJobData.contactPhone
      );
      expect(response.body.location).toBe(validJobData.location);
      expect(response.body.salary).toBe(validJobData.salary);
      expect(response.body.experienceLevel).toBe(validJobData.experienceLevel);
      expect(response.body.status).toBe(validJobData.status);
      expect(response.body.requirements).toEqual(validJobData.requirements);
    });

    it("should return 400 error when required fields are missing", async () => {
      const response = await request(app)
        .post("/api/jobs")
        .send(invalidJobData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Required fields are missing");
    });

    it("should return 400 error when title is missing", async () => {
      const dataWithoutTitle = { ...validJobData };
      delete dataWithoutTitle.title;

      const response = await request(app)
        .post("/api/jobs")
        .send(dataWithoutTitle)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 error when type is missing", async () => {
      const dataWithoutType = { ...validJobData };
      delete dataWithoutType.type;

      const response = await request(app)
        .post("/api/jobs")
        .send(dataWithoutType)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 error when description is missing", async () => {
      const dataWithoutDescription = { ...validJobData };
      delete dataWithoutDescription.description;

      const response = await request(app)
        .post("/api/jobs")
        .send(dataWithoutDescription)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 error when companyName is missing", async () => {
      const dataWithoutCompanyName = { ...validJobData };
      delete dataWithoutCompanyName.companyName;

      const response = await request(app)
        .post("/api/jobs")
        .send(dataWithoutCompanyName)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 error when contactEmail is missing", async () => {
      const dataWithoutContactEmail = { ...validJobData };
      delete dataWithoutContactEmail.contactEmail;

      const response = await request(app)
        .post("/api/jobs")
        .send(dataWithoutContactEmail)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 error when contactPhone is missing", async () => {
      const dataWithoutContactPhone = { ...validJobData };
      delete dataWithoutContactPhone.contactPhone;

      const response = await request(app)
        .post("/api/jobs")
        .send(dataWithoutContactPhone)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should handle database errors gracefully", async () => {
      // Mock Job.create to throw an error
      const originalCreate = Job.create;
      Job.create = jest
        .fn()
        .mockRejectedValue(new Error("Database connection failed"));

      const response = await request(app)
        .post("/api/jobs")
        .send(validJobData)
        .expect(500);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Database connection failed");

      // Restore original method
      Job.create = originalCreate;
    });
  });

  describe("GET /api/jobs/:jobId", () => {
    let createdJob;

    beforeEach(async () => {
      // Create a job for testing using the model structure
      const jobData = {
        title: validJobData.title,
        type: validJobData.type,
        description: validJobData.description,
        company: {
          name: validJobData.companyName,
          contactEmail: validJobData.contactEmail,
          contactPhone: validJobData.contactPhone,
          website: validJobData.website,
          size: validJobData.size,
        },
        location: validJobData.location,
        salary: validJobData.salary,
        experienceLevel: validJobData.experienceLevel,
        status: validJobData.status,
        applicationDeadline: validJobData.applicationDeadline,
        requirements: validJobData.requirements,
      };
      createdJob = await Job.create(jobData);
    });

    it("should return a job by valid ID", async () => {
      const response = await request(app)
        .get(`/api/jobs/${createdJob._id}`)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe(validJobData.title);
      expect(response.body.type).toBe(validJobData.type);
      expect(response.body.description).toBe(validJobData.description);
    });

    it("should return null for non-existent job ID", async () => {
      const nonExistentId = new Job()._id;
      const response = await request(app)
        .get(`/api/jobs/${nonExistentId}`)
        .expect(200);

      expect(response.body).toBeNull();
    });

    it("should return 400 error for invalid jobId format", async () => {
      const response = await request(app)
        .get("/api/jobs/invalid-id")
        .expect(500);

      expect(response.body).toHaveProperty("error");
    });

    it("should handle database errors gracefully", async () => {
      // Mock Job.findById to throw an error
      const originalFindById = Job.findById;
      Job.findById = jest
        .fn()
        .mockRejectedValue(new Error("Database query failed"));

      const response = await request(app)
        .get(`/api/jobs/${createdJob._id}`)
        .expect(500);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Database query failed");

      // Restore original method
      Job.findById = originalFindById;
    });
  });

  describe("PUT /api/jobs/:jobId", () => {
    let createdJob;

    beforeEach(async () => {
      // Create a job for testing using the model structure
      const jobData = {
        title: validJobData.title,
        type: validJobData.type,
        description: validJobData.description,
        company: {
          name: validJobData.companyName,
          contactEmail: validJobData.contactEmail,
          contactPhone: validJobData.contactPhone,
          website: validJobData.website,
          size: validJobData.size,
        },
        location: validJobData.location,
        salary: validJobData.salary,
        experienceLevel: validJobData.experienceLevel,
        status: validJobData.status,
        applicationDeadline: validJobData.applicationDeadline,
        requirements: validJobData.requirements,
      };
      createdJob = await Job.create(jobData);
    });

    it("should update a job with valid data", async () => {
      const updatedData = {
        ...validJobData,
        title: "Senior Software Engineer",
        salary: 150000,
        experienceLevel: "Senior",
      };

      const response = await request(app)
        .put(`/api/jobs/${createdJob._id}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.title).toBe(updatedData.title);
      expect(response.body.salary).toBe(updatedData.salary);
      expect(response.body.experienceLevel).toBe(updatedData.experienceLevel);
    });

    it("should return 400 error when required fields are missing", async () => {
      const response = await request(app)
        .put(`/api/jobs/${createdJob._id}`)
        .send(invalidJobData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("All fields are required");
    });

    it("should return 400 error when title is missing", async () => {
      const dataWithoutTitle = { ...validJobData };
      delete dataWithoutTitle.title;

      const response = await request(app)
        .put(`/api/jobs/${createdJob._id}`)
        .send(dataWithoutTitle)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 error when type is missing", async () => {
      const dataWithoutType = { ...validJobData };
      delete dataWithoutType.type;

      const response = await request(app)
        .put(`/api/jobs/${createdJob._id}`)
        .send(dataWithoutType)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 error when description is missing", async () => {
      const dataWithoutDescription = { ...validJobData };
      delete dataWithoutDescription.description;

      const response = await request(app)
        .put(`/api/jobs/${createdJob._id}`)
        .send(dataWithoutDescription)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 error when companyName is missing", async () => {
      const dataWithoutCompanyName = { ...validJobData };
      delete dataWithoutCompanyName.companyName;

      const response = await request(app)
        .put(`/api/jobs/${createdJob._id}`)
        .send(dataWithoutCompanyName)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 error when contactEmail is missing", async () => {
      const dataWithoutContactEmail = { ...validJobData };
      delete dataWithoutContactEmail.contactEmail;

      const response = await request(app)
        .put(`/api/jobs/${createdJob._id}`)
        .send(dataWithoutContactEmail)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 error when contactPhone is missing", async () => {
      const dataWithoutContactPhone = { ...validJobData };
      delete dataWithoutContactPhone.contactPhone;

      const response = await request(app)
        .put(`/api/jobs/${createdJob._id}`)
        .send(dataWithoutContactPhone)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return null for non-existent job ID", async () => {
      const nonExistentId = new Job()._id;
      const response = await request(app)
        .put(`/api/jobs/${nonExistentId}`)
        .send(validJobData)
        .expect(200);

      expect(response.body).toBeNull();
    });

    it("should handle database errors gracefully", async () => {
      // Mock Job.findByIdAndUpdate to throw an error
      const originalFindByIdAndUpdate = Job.findByIdAndUpdate;
      Job.findByIdAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error("Database update failed"));

      const response = await request(app)
        .put(`/api/jobs/${createdJob._id}`)
        .send(validJobData)
        .expect(500);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Database update failed");

      // Restore original method
      Job.findByIdAndUpdate = originalFindByIdAndUpdate;
    });
  });

  describe("DELETE /api/jobs/:jobId", () => {
    let createdJob;
    beforeEach(async () => {
      const jobData = {
        title: validJobData.title,
        type: validJobData.type,
        description: validJobData.description,
        company: {
          name: validJobData.companyName,
          contactEmail: validJobData.contactEmail,
          contactPhone: validJobData.contactPhone,
          website: validJobData.website,
          size: validJobData.size,
        },
        location: validJobData.location,
        salary: validJobData.salary,
        experienceLevel: validJobData.experienceLevel,
        status: validJobData.status,
        applicationDeadline: validJobData.applicationDeadline,
        requirements: validJobData.requirements,
      };
      createdJob = await Job.create(jobData);
    });
    it("should delete a job", async () => {
      const response = await request(app)
        .delete(`/api/jobs/${createdJob._id}`)
        .expect(200);
      expect(response.body.message).toBe("Job deleted successfully");
    });
  });

  describe("Error handling", () => {
    it("should return 404 for unknown endpoints", async () => {
      const response = await request(app).get("/api/unknown").expect(404);

      expect(response.body).toHaveProperty("error");
    });
  });
});
