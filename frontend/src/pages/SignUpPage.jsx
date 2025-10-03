import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

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

export default Signup;
