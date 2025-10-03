# Self-Assessment

## Example 1: Protected routs with middleware

Initially route ware not proteced any can could update and delete the job now it requires token

```javascript
const requireAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    //   console.log(authorization);
    //   console.log(authorization.split(" "));
    //   console.log(authorization.split(" ")[0]);
    //   console.log(authorization.split(" ")[1]);

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET);

    req.user = await User.findById(decoded._id).select("_id");

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ error: "Request is not authorized" });
  }
};
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/", getAllJobs);
router.post("/", requireAuth, createJob);
router.get("/:jobId", getJobById);
router.put("/:jobId", requireAuth, updateJob);
router.delete("/:jobId", requireAuth, deleteJob);
 ```

**userControler.js**
```javascript
// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userSignup = async (req, res) => {
  try {
    const {
      name,
      username,
      phone_number,
      password,
      gender,
      date_of_birth,
      membership_status,
      bio,
      address,
      profile_picture,
    } = req.body;

    if (
      !username ||
      !password ||
      !name ||
      !phone_number ||
      !gender ||
      !date_of_birth ||
      !membership_status ||
      !address
    ) {
      return res
        .status(400)
        .json({
          error:
            "Username,name, phone number, gender, date of birth, membership status, address, password are required",
        });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      phone_number,
      password: hashedPassword,
      gender,
      date_of_birth,
      membership_status,
      bio,
      address,
      profile_picture,
    });

    const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```
- check the existingUser and validation
- get all user expect user password
- validation 

test cases for the user 


## Frontend 
created api context for auth and verify token

```javascript
import { createContext, useReducer, useEffect } from "react";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return { ...state, user: action.payload, token: action.payload.token };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Verifying token:", token);
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.valid) {
          dispatch({ type: "LOGIN", payload: data.user });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        dispatch({ type: "LOGOUT" });
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch({ type: "LOGIN", payload: JSON.parse(storedUser) });
    }
  }, []);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ state, dispatch, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

```
- helps to login signup 
- handle token and verify

**layout**
```javascript
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const MainLayout = () => {
  const { state, verifyToken } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    verifyToken();
    if (!state?.user) {
      console.log("No user found in MainLayout");
      navigate("/login");
    }
  }, []);
  return (
    <>
      <Navbar />
      <Outlet />
      <ToastContainer />
    </>
  );
};
export default MainLayout;
```
## single component form for the edit and add jobs
```javascript
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
    <form>
  )

## addjob page and edit page
    <div className="create">
      <h2>Add a New Job</h2>
      <JobForm
        initialData={initialData}
        onSubmit={handleAddJob}
        buttonLabel="Add Job"
      />
    </div>

- home pages for jobs list 
```

**Key Improvement:**
1. **Auth context with useReducer and useContext from react to handle user and token**
2. **Middleware to check auth in backend**
3. **Better Error Messages**: More descriptive error messages indicating specific missing fields
4. **Consistent Error Handling**: Standardized error responses across create and update operations
5. **Test Alignment**: Updated tests to match improved error handling and added edge case coverage
6. **Input Sanitization**: Added checks for data types and formats

