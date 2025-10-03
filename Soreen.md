# Self-Assessment

## Example 1: Improving Input Validation and Error Handling

Initially, our `getJobById` endpoint had basic functionality but lacked proper validation for MongoDB ObjectId format. Here's the original implementation:

**jobControllers.js**

```javascript
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
```

The endpoint worked for valid MongoDB ObjectIds like:

```
GET http://localhost:4000/api/jobs/507f1f77bcf86cd799439011
```

However, it failed when:

- Invalid ObjectId format was provided (e.g., "invalid-id")
- Non-existent but valid ObjectId format was used
- Database connection issues occurred

To address these issues, we refactored the code to handle edge cases effectively:

**jobControllers.js**

```javascript
// Optimized getJobById
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
```

**Key Improvements:**

- **ObjectId Validation**: Added `mongoose.Types.ObjectId.isValid()` to validate ID format before database query
- **Resource Not Found**: Added explicit check for null result and return 404 status
- **Better Error Messages**: Distinguished between client errors (400/404) and server errors (500)
- **Error Logging**: Added console.error for debugging server-side issues

## Example 2: Improving Data Validation and Test Coverage

Initially, our `createJob` controller had basic validation but lacked comprehensive error handling and proper test coverage. Here's the original implementation:

**jobControllers.js**

```javascript
// POST /jobs
const createJob = async (req, res) => {
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
    return res.status(400).json({ error: "Required fields are missing" });
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
```

The endpoint worked for valid data but had several issues:

- Repetitive validation logic between create and update
- No email format validation
- No salary range validation
- Inconsistent error messages
- Tests didn't match actual error handling behavior

**Solution:**
We refactored to use validation middleware and improved data validation:

**jobControllers.js**

```javascript
// Improved validation helper
const validateJobData = (data, isUpdate = false) => {
  const requiredFields = [
    "title",
    "type",
    "description",
    "companyName",
    "contactEmail",
    "contactPhone",
    "salary",
    "location",
  ];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.contactEmail)) {
    return { isValid: false, error: "Invalid email format" };
  }

  // Salary validation
  if (data.salary && (isNaN(data.salary) || data.salary < 0)) {
    return { isValid: false, error: "Salary must be a positive number" };
  }

  return { isValid: true };
};

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
```

We also updated our tests to match the improved validation:

**jobRoutes.test.js**

```javascript
// Improved test for invalid ObjectId
it("should return 400 error for invalid jobId format", async () => {
  const response = await request(app).get("/api/jobs/invalid-id").expect(400);

  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toBe("Invalid job ID format");
});

// Added new test for non-existent valid ObjectId
it("should return 404 for non-existent but valid ObjectId", async () => {
  const validButNonExistentId = "507f1f77bcf86cd799439011";
  const response = await request(app)
    .get(`/api/jobs/${validButNonExistentId}`)
    .expect(404);

  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toBe("Job not found");
});
```

**Key Improvements:**

- **Centralized Validation**: Created reusable validation function to eliminate code duplication
- **Enhanced Validation**: Added email format and salary range validation
- **Better Error Messages**: More descriptive error messages indicating specific missing fields
- **Consistent Error Handling**: Standardized error responses across create and update operations
- **Test Alignment**: Updated tests to match improved error handling and added edge case coverage
- **Input Sanitization**: Added checks for data types and formats

## Summary of Lessons Learned

1. **Input Validation is Critical**: Always validate data format, especially for database operations
2. **Error Handling Consistency**: Use appropriate HTTP status codes and consistent error message formats
3. **Test Alignment**: Keep tests synchronized with actual implementation behavior
4. **Code Reusability**: Extract common validation logic to avoid duplication
5. **Future-Proofing**: Design API structure to accommodate future enhancements
