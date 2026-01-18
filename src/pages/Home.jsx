import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";


function Home() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // check login on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");

    if (token && name) {
      setIsLoggedIn(true);
      setUserName(name);
    }
  }, []);

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post(
        "https://wishers-backend.onrender.com/api/auth/google",
        {
          token: credentialResponse.credential,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("userName", res.data.user.name);

      setIsLoggedIn(true);
      setUserName(res.data.user.name);
    } catch {
      alert("Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4
      bg-linear-to-br from-slate-100 via-indigo-50 to-cyan-100">

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center
        animate-fadeIn">

        <h1 className="text-4xl font-extrabold mb-2 text-indigo-600">
          Wishers 🎉
        </h1>

        <p className="text-gray-500 mb-6">
          Create beautiful birthday wishes
        </p>

        {!isLoggedIn ? (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert("Google Login Failed")}
          />
        ) : (
          <div className="text-center">
            <p className="text-xl mb-6">
              Hello, <span className="font-semibold">{userName}</span> 👋
            </p>

            <button
              onClick={() => navigate("/create")}
              className="w-full bg-indigo-600 hover:bg-indigo-700
                transition text-white px-6 py-3 rounded-xl
                font-medium shadow mb-4"
            >
              Create a Birthday Wish
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2
                text-sm font-medium text-slate-500
                hover:text-red-600 transition group"
            >
              <span className="group-hover:underline">Logout</span>
              <span className="opacity-0 group-hover:opacity-100 transition">
                🔒
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
