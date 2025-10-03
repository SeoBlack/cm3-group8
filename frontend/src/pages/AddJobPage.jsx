import { useNavigate } from "react-router-dom";
import JobForm from "../components/JobForm";

const AddJobPage = () => {
  const navigate = useNavigate();

  const initialData = {
    title: "",
    type: "Full-Time",
    description: "",
    companyName: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    size: "",
    location: "",
    salary: "",
    experienceLevel: "",
    requirements: "",
    applicationDeadline: "",
    status: "Open",
  };

  const handleAddJob = async (form) => {
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          type: form.type,
          description: form.description,
          companyName: form.companyName,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
          website: form.website,
          size: form.size,
          location: form.location,
          salary: form.salary,
          experienceLevel: form.experienceLevel,
          requirements: form.requirements,
          applicationDeadline: form.applicationDeadline,
          status: form.status,
        }),
      });
      if (!res.ok) throw new Error("Failed to create job");
      await res.json();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="create">
      <h2>Add a New Job</h2>
      <JobForm
        initialData={initialData}
        onSubmit={handleAddJob}
        buttonLabel="Add Job"
      />
    </div>
  );
};

export default AddJobPage;
