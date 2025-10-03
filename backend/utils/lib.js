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

module.exports = {
  validateJobData,
};
