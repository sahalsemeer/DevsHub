import axios from "axios";
import React, { useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BASE_API } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../store/connectionSlice";
import { useNavigate } from "react-router-dom";

const Connections = () => {
  const connection = useSelector((state) => state.connection);
  // console.log(connection?.connections?.length);
  const nav = useNavigate();

  const dispatch = useDispatch();
  const getConnections = async () => {
    const res = await axios.get(BASE_API + "/user/requests/connections", {
      withCredentials: true,
    });
    // console.log(res?.data?.data);

    dispatch(addConnection(res?.data?.data));
  };
  useEffect(() => {
    getConnections();
  }, []);

  if (!connection.connections) return null;

  if (connection.connections.length === 0)
    return (
      <h1 className="text-center mt-6 font-extrabold text-xl">
        No Connections Found.
      </h1>
    );

  return (
    <div className="p-10">
      <h1 className="text-center mt-6 font-extrabold text-xl">Connections</h1>
      <div className="flex justify-center">
        <div className="mt-6">
          {connection.connections.map((user) => {
            const { firstName, lastName, about, photoURL, _id } = user;
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

                    {/* OPTIONS */}
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-sm">
                        <BsThreeDotsVertical className="text-xl" />
                      </label>

                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-40"
                      >
                        <li>
                          <a>View Profile</a>
                        </li>
                        <li>
                          <a onClick={() => nav(`/chat/${_id}`)}>Message</a>
                        </li>
                        <li>
                          <a className="text-error">Remove</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Connections;
