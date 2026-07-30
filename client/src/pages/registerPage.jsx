import { useState } from "react";
import React from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

import { usePopup } from "../PopupContext";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { showAlert } = usePopup();

  const Register = async (ev) => {
    ev.preventDefault();
    if (!name || name.trim().length < 2) {
      showAlert("Full Name must be at least 2 characters long.", "error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showAlert("Please enter a valid email address.", "error");
      return;
    }
    if (!password || password.length < 6) {
      showAlert("Password must be at least 6 characters long.", "error");
      return;
    }
    try {
      await axios.post("/register", {
        name,
        email,
        password,
      });
      await showAlert("Registration Successful! Redirecting to login...", "success");
      setRedirect(true);
    } catch (e) {
      showAlert("Registration Failed. Please try again.", "error");
    }
  };
  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-xl dark:shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">Create Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Sign up to start booking accommodations</p>
        </div>
        <form onSubmit={Register} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5 pl-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5 pl-1">Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5 pl-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
            />
          </div>
          <button type="submit" className="primary mt-2">Sign Up</button>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
            Already a member?{" "}
            <Link to="/login" className="text-rose-500 dark:text-rose-400 font-bold hover:underline transition">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
