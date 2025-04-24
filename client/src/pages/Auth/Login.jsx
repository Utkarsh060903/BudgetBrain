// import Input from "@/components/Inputs/Input";
// import AuthLayout from "@/components/layouts/AuthLayout";
// import { UserContext } from "@/context/userContext";
// import { API_PATHS } from "@/utils/apiPaths";
// import axiosInstance from "@/utils/axiosInstance";
// import { validateEmail } from "@/utils/helper";
// import React, { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);

//   const {updateUser} = useContext(UserContext);

//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if(!validateEmail(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     if(!password) {
//       setError("Password is required");
//       return;
//     }

//     setError(null)

//     //api call to login user
//     try{
//       const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
//         email,
//         password,
//       })
//       const {token, user} = response.data;

//       if(token) {
//         localStorage.setItem("token", token);
//         updateUser(user);
//         navigate("/dashboard");
//       }
//     } catch(err) {
//       console.log(err);
//       setError("Something went wrong, please try again later");
//     }
//   };

//   return (
//     <AuthLayout>
//       <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
//         <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
//         <p className="text-xs text-slate-700 mt-[5px] mb-6">
//           Please enter your credentials to access your account.
//         </p>

//         <form onSubmit={handleLogin}>
//           <Input
//             value={email}
//             onChange={({ target }) => setEmail(target.value)}
//             label="Email Address"
//             placeholder="john@example.com"
//             type="text"
//           />

//           <Input
//             value={password}
//             onChange={({ target }) => setPassword(target.value)}
//             label="Password"
//             placeholder="********"
//             type="password"
//           />

//           {error && <p className="text-red-500 text-xs pb-2.5">{error}</p> }

//           <button className="btn-primary" type="submit">LOGIN</button>

//           <p className="text-[13px] text-slate-800 mt-3">Don't have an accout?{" "}
//             <Link className="font-medium underline text-blue-700 cursor-pointer" to="/signup">SignUp</Link>
//           </p>
//         </form>
//       </div>
//     </AuthLayout>
//   );
// };

// export default Login;

import Input from "@/components/Inputs/Input";
import AuthLayout from "@/components/layouts/AuthLayout";
import { UserContext } from "@/context/userContext";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { validateEmail } from "@/utils/helper";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase/config"; // Import your Firebase auth instance

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if(!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if(!password) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    setError(null);

    //api call to login user
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const {token, user} = response.data;

      if(token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch(err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong, please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      
      const { email, photoURL, displayName } = result.user;
      const idToken = await result.user.getIdToken();
      
      const response = await axiosInstance.post(API_PATHS.AUTH.GOOGLE_LOGIN, {
        idToken,
        fullName: displayName || email.split('@')[0],
        profileImageUrl: photoURL || ''
      });
      
      const { token, user } = response.data;
      
      if (token) {
        localStorage.setItem("token", token);
        updateUser({
          ...user,
          fullName: user.fullName || user.name,
        });
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
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

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button 
            className="btn-primary w-full" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>

          <div className="my-4 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <p className="mx-4 text-xs text-gray-500">OR</p>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center items-center bg-white border border-gray-300 rounded-md py-2 px-4 text-sm hover:bg-gray-50 transition duration-150"
            disabled={isLoading}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </button>

          <p className="text-[13px] text-slate-800 mt-3">Don't have an account?{" "}
            <Link className="font-medium underline text-blue-700 cursor-pointer" to="/signup">SignUp</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;