import JobListings from "../components/JobListings";
import { useEffect, useState } from "react";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  console.log("Component", data);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch("/api/jobs?_limit=3");
      const data = await res.json();
      setData(data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  return (
    <div className="home">
      <h1>Job Listings</h1>
      {loading ? <p>Loading...</p> : <JobListings jobs={data} />}
    </div>
  );
};

export default Home;
