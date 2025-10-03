import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JobForm from "../components/JobForm";

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) throw new Error("Failed to fetch job");
        const data = await res.json();

        setFormData({
          title: data.title || "",
          type: data.type || "Full-Time",
          description: data.description || "",
          companyName: data.companyName || "",
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
          website: data.website || "",
          size: data.size || "",
          location: data.location || "",
          salary: data.salary || "",
          experienceLevel: data.experienceLevel || "",
          requirements: data.requirements || "",
          applicationDeadline: data.applicationDeadline || "",
          status: data.status || "Open",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleUpdateJob = async (form) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
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
      if (!res.ok) throw new Error("Failed to update job");
      await res.json();
      navigate(`/jobs/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="create">
      <h2>Edit Job</h2>
      <JobForm
        initialData={formData}
        onSubmit={handleUpdateJob}
        buttonLabel="Update Job"
      />
    </div>
  );
};

export default EditJobPage;
