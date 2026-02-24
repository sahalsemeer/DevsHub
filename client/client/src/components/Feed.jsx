import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_API } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../store/feedSlice";
import UserCard from "./UserCard";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const feed = useSelector((state) => state.feed);
  const user = feed?.feed;
  // console.log(user);
  // console.log(user.length);

  // console.log(feed?.feed[0]?.firstName);
  const getFeed = async () => {
    try {
      const res = await axios.get(`${BASE_API}/user/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (error) {
      console.log(error);
      if (error.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!user) return null;
  if (user.length === 0) return <div>No Users Found.</div>;

  return  <UserCard user={user[0]} />;


};

export default Feed;
