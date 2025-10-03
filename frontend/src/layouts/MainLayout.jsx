import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
