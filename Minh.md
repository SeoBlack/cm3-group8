# Self-Assessment
## Front-end
//LoginPage.jsx
const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const username = useField("username");
  const password = useField("password");
  const { login, isLoading, error } = useLogin("/api/users/login");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await login({
      username: username.value,
      password: password.value,
    });
    if (!error) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  return (
    <div className="create">
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Username:</label>
        <input {...username} />
        <label>Password:</label>
        <input {...password} />
        <button>Login</button>
      </form>
    </div>
  );
};

//SignUpPage
const Signup = ({ setIsAuthenticated }) => {
   
  const navigate = useNavigate();
  const name = useField("text");
  const username = useField("username");
  const password = useField("password");
  const phoneNumber = useField("text");
  const gender = useField("text");
  const bio = useField("text")
  const dateOfBirth = useField("date");
  const address = useField("text")
  const membershipStatus = useField("text");

  const { signup, error } = useSignup("/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await signup({
      
      username: username.value,
      password: password.value,
      name: name.value,
      phone_number: phoneNumber.value,
      gender: gender.value,
      date_of_birth: dateOfBirth.value,
      bio: bio.value,
      address:address.value,
      membership_status: membershipStatus.value,
    });
    if (!error) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input {...name} />
        <label>Username:</label>
        <input {...username} />
        <label>Password:</label>
        <input {...password} />
        <label>Phone Number:</label>
        <input {...phoneNumber} />
        <label>Gender:</label>  
        <input {...gender} />
        <label>Bio:</label>
        <input {...bio}></input>
        <label> Address:</label>
        <input {...address}></input>
        <label>Date of Birth:</label>
        <input {...dateOfBirth} />
        <label>Membership Status:</label>
        <input {...membershipStatus} />
        <button>Sign up</button>
      </form>
    </div>
  );
};

## For front-end , i don't have any problems during the coding marathon 3 , everthings worked okay for me  , testing is good 


## Back-end
//GET / jobs;
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
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

## Same for Back-end , i didn't have any trouble while coding for the backend , the testing went fine and everthing worked

## Created Navbar , authentication for App.jsx and also the hooks (useField.jsx,useLogin.jsx,useSignup.jsx)

## Navbar 
const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const handleClick = (e) => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <h1>React Jobs</h1>
      </Link>
      <div className="links">
        {isAuthenticated && (
          <div>
            <Link to="/jobs/add-job">Add Job</Link>
            <span>{JSON.parse(localStorage.getItem("user"))}</span>
            <button onClick={handleClick}>Log out</button>
          </div>
        )}
        {!isAuthenticated && (
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  );
};





