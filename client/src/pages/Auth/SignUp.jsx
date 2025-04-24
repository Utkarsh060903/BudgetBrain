import React, { useContext, useState } from "react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { validateEmail } from "@/utils/helper";
import { Link, useNavigate } from "react-router-dom";
import Input from "@/components/Inputs/Input";
import ProfilePhotoSelector from "@/components/Inputs/ProfilePhotoSelector";
import { API_PATHS } from "@/utils/apiPaths";
import { UserContext } from "@/context/userContext";
import axiosInstance from "@/utils/axiosInstance";
import { uploadImage } from "@/utils/uploadImage";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase/config";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let profileImageUrl = "";
    if (!fullName) {
      setError("Full Name is required");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    setError(null);

    try {
      // Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Signup error:", err);
      // Extract error message from response if available
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
      const result = await signInWithPopup(auth, provider);
      
      // Get the Google ID token
      const idToken = await result.user.getIdToken();
      
      // Send the token to your backend
      const response = await axiosInstance.post(API_PATHS.AUTH.GOOGLE_LOGIN, {
        idToken,
      });
      
      const { token, user } = response.data;
      
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
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
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label={"Full Name"}
              placeholder={"John Doe"}
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
            />

            <div className="col-span-2">
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="********"
                type="password"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button 
            className="btn-primary w-full" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "SIGNING UP..." : "SIGN UP"}
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
            Sign up with Google
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link
              className="font-medium underline text-blue-700 cursor-pointer"
              to="/login"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;