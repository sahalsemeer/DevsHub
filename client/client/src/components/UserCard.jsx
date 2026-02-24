import axios from "axios";
import React from "react";
import { BASE_API } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFeed } from "../store/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch()
  console.log(user);
  const { _id,firstName, lastName, about, photoURL } = user;

  const sendRequest = async (status,userId) => {
    try {
      const res = await axios.post(`${BASE_API}/connection/send/${status}/${userId}`,{},{withCredentials:true})
      dispatch(removeFeed(_id))
      
    } catch (error) {
      console.log(error);
      
    }

  }

  

  return (
    <div className="flex justify-center mt-6 p-2">
      <div className="card bg-base-300 w-70 shadow-sm">
        <figure>
          <img src={photoURL} alt="Profile Photo" className="h-full" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          <p>{about}</p>
          <div className="card-actions justify-center mt-2">
            <button className="btn btn-secondary mr-2" onClick={() => sendRequest('interested',_id)}>Interested</button>
            <button className="btn btn-primary mr-2" onClick={() => sendRequest('ignored',_id)}>Ignore</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
