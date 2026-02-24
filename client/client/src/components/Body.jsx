import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_API } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/userSlice";
import { removeAllFeed } from "../store/feedSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const fetchUser = async () => {
    try {
      if (user === null) return;
      const res = await axios.get(`${BASE_API}/profile/view`, {
        withCredentials: true,
      });
      dispatch(login(res.data));
    } catch (error) {
      if (error.status === 401) {
        navigate("/login");
      }
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="grow">
        <Outlet />
      </div>
      {!location.pathname.startsWith("/chat") && <Footer />}
    </div>
  );
};

export default Body;
