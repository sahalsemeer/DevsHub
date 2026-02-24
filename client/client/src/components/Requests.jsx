import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_API } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../store/requestsSlice";

const Requests = () => {
  const [showToast, setShowToast] = useState(false);
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.requests);
  console.log(requests);
  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_API + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequest(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const reviewRequests = async (status, connectionId) => {
    try {
      console.log(connectionId);
      const res = await axios.post(
        `${BASE_API}/connection/review/${status}/${connectionId}`,
        {},
        { withCredentials: true }
      );
      setStatus(status);
      console.log(res);
      dispatch(removeRequest(connectionId));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRequests();
  }, []);

  if (!requests?.requests) return null;
  if (requests?.requests?.length === 0) return <h1>No Request Found.</h1>;
  return (
    <div>
      <h1 className="text-center mt-6 font-extrabold text-xl">Requests</h1>
      <div className="flex justify-center">
        <div className="mt-6">
          {requests.requests.map((user) => {
            console.log(user._id);
            const { firstName, lastName, about, photoURL, _id } =
              user.FromUserId;
            return (
              <div
                key={_id}
                className="card w-200 bg-base-300 card-xs shadow-sm mt-2 "
              >
                <div className="card-body px-4 py-3">
                  <div className="flex justify-between items-center">
                    {/* AVATAR */}
                    <div className="avatar">
                      <div className="ring-primary ring-offset-base-100 w-18 rounded-full ring-2 ring-offset-2">
                        <img src={photoURL} alt="profile" />
                      </div>
                    </div>

                    {/* USER INFO */}
                    <div>
                      <p className="text-lg font-bold">
                        {firstName + " " + lastName}
                      </p>
                      <p>{about}</p>
                    </div>

                    {/*  ACCEPT/REJECT BTN */}
                    <div className="flex gap-4">
                      <button
                        className="btn btn-active btn-success"
                        onClick={() => reviewRequests("accepted", user._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-active btn-error"
                        onClick={() => reviewRequests("rejected", user._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Request {status}!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
