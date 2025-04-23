import Input from "@/components/Inputs/Input";
import AuthLayout from "@/components/layouts/AuthLayout";
import { UserContext } from "@/context/userContext";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { validateEmail } from "@/utils/helper";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if(!password) {
      setError("Password is required");
      return;
    }

    setError(null)

    //api call to login user
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      })
      const {token, user} = response.data;

      if(token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch(err) {
      console.log(err);
      setError("Something went wrong, please try again later");
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your credentials to access your account.
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="********"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p> }

          <button className="btn-primary" type="submit">LOGIN</button>

          <p className="text-[13px] text-slate-800 mt-3">Don't have an accout?{" "}
            <Link className="font-medium underline text-blue-700 cursor-pointer" to="/signup">SignUp</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
