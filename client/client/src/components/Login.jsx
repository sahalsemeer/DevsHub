import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import { BASE_API } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("kendall@gmail.com");
  const [password, setPassword] = useState("#Uzumymw123");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoginPage, setIsLoginPage] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginBtn = async () => {
    try {
      const res = await axios.post(
        `${BASE_API}/login`,
        {
          emailId: email,
          password: password,
        },
        { withCredentials: true }
      );
      dispatch(login(res.data));
      navigate("/feed");
    } catch (error) {
      console.log(error);
      setErrorMessage(error?.response?.data);
    }
  };

  const handleSignUpbtn = async () => {
    try {
      const res = await axios.post(
        BASE_API + "/signup",
        {
          firstName: firstName,
          lastName: lastName,
          emailId: email,
          password: password,
        },
        { withCredentials: true }
      );
      console.log(res);
      dispatch(login(res.data))
      navigate('/profile')
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center p-15">
      <div className="card card-border bg-base-200 w-96">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginPage ? "Login" : "SignUp"}
          </h2>
          {!isLoginPage && (
            <>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">First Name</legend>
                <input
                  type="text"
                  value={firstName}
                  className="input"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Last Name</legend>
                <input
                  type="text"
                  value={lastName}
                  className="input"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </fieldset>
            </>
          )}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              type="text"
              value={email}
              className="input"
              placeholder="Enter Email here"
              onChange={(e) => setEmail(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              value={password}
              className="input"
              placeholder="Enter Password here"
              onChange={(e) => setPassword(e.target.value)}
            />
          </fieldset>
          <p className="text-red-700">{errorMessage}</p>

          <div className="card-actions justify-center mt-4">
            <button
              className="btn btn-primary"
              onClick={isLoginPage ? handleLoginBtn : handleSignUpbtn}
            >
              {isLoginPage ? "Login" : "Sign Up"}
            </button>
          </div>
          <p
            className="text-sm mt-2 cursor-pointer"
            onClick={() => setIsLoginPage(!isLoginPage)}
          >
            {isLoginPage
              ? "New to DevsHub? SignUp here."
              : "Alredy a user? Login here."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
