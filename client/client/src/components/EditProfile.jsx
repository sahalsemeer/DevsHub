import React, { useState } from "react";
import UserCard from "./UserCard";
import { use } from "react";
import axios from "axios";
import { BASE_API } from "../utils/constants";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";

const EditProfile = ({ user }) => {
  if (!user) return null;

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [photoURL, setPhotoURL] = useState(user.photoURL);
  const [about, setAbout] = useState(user.about);
  const [showToast, setShowToast] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();

  const updateProfile = async () => {
    setErrorMessage("");
    try {
      const res = await axios.patch(
        BASE_API + "/profile/edit",
        { firstName, lastName, age, gender, photoURL, about },
        { withCredentials: true }
      );
      dispatch(login(res?.data?.user));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false)
      },1000)
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data);
    }
  };

  return (
    <div>
      <div className="flex justify-center p-15">
        <div className="card card-border bg-base-200 w-150">
          <div className="card-body">
            <h2 className="card-title justify-center">Edit Profile</h2>

            <UserCard user={{ firstName, lastName, about, photoURL }} />

            <div className="justify-center">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">FirstName</legend>
                <input
                  type="text"
                  value={firstName}
                  className="input"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">LastName</legend>
                <input
                  type="text"
                  value={lastName}
                  className="input"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Age</legend>
                <input
                  type="text"
                  value={age}
                  className="input"
                  onChange={(e) => setAge(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Gender</legend>
                <input
                  type="text"
                  value={gender}
                  className="input"
                  onChange={(e) => setGender(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Photo URL</legend>
                <input
                  type="text"
                  value={photoURL}
                  className="input"
                  onChange={(e) => setPhotoURL(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">About</legend>
                <input
                  type="text"
                  value={about}
                  className="input"
                  onChange={(e) => setAbout(e.target.value)}
                />
              </fieldset>
            </div>
            <p className="text-red-700">{errorMessage}</p>

            <div className="card-actions justify-center mt-4">
              <button className="btn btn-primary" onClick={updateProfile}>
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile Updated Succesfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
