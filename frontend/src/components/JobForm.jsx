import { useState, useEffect } from "react";

const JobForm = ({ initialData, onSubmit, buttonLabel }) => {
  const [form, setForm] = useState(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="create">
      <form onSubmit={handleSubmit}>
        <label>Job Title:</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <label>Job Type:</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Remote">Remote</option>
          <option value="Internship">Internship</option>
        </select>
        <label>Job Description:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <label>Company Name:</label>
        <input
          type="text"
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          required
        />
        <label>Contact Email:</label>
        <input
          type="email"
          name="contactEmail"
          value={form.contactEmail}
          onChange={handleChange}
          required
        />
        <label>Contact Phone:</label>
        <input
          type="tel"
          name="contactPhone"
          value={form.contactPhone}
          onChange={handleChange}
          required
        />
        <label>Company Website:</label>
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={handleChange}
          required
        />
        <label> Size:</label>
        <input
          type="number"
          name="size"
          value={form.size}
          onChange={handleChange}
          required
        />{" "}
        <label>location :</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
        />{" "}
        <label>salary:</label>
        <input
          type="number"
          name="salary"
          value={form.salary}
          onChange={handleChange}
          required
        />{" "}
        <label> Experience Level:</label>
        <select
          name="type"
          value={form.experienceLevel}
          onChange={handleChange}
        >
          <option value="Entry">Entry-Level</option>
          <option value="Mid">Mid-Level</option>
          <option value="Senior">Senior-Level</option>
        </select>
        <label>Employee Requirements:</label>
        <input
          type="text"
          name="requirements"
          value={form.requirements}
          onChange={handleChange}
          required
        />{" "}
        <select name="type" value={form.status} onChange={handleChange}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <label>Application Deadline:</label>
        <input
          type="date"
          name="applicationDeadline"
          value={form.applicationDeadline}
          onChange={handleChange}
          required
        />
        <button type="submit">{buttonLabel}</button>
      </form>
    </div>
  );
};

export default JobForm;
