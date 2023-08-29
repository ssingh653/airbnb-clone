import { useState } from "react";
import React from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const Register = (ev) => {
    ev.preventDefault();
    try {
      axios.post("/register", {
        name,
        email,
        password,
      });
      setRedirect(true);
      alert("Registration Success");
    } catch (e) {
      alert("Registration Failed");
    }
  };
  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="p-2 text-4xl text-center mb-4">Sign Up</h1>
        <form className="max-w-md mx-auto" onSubmit={Register}>
          <input
            type="text"
            placeholder="full name"
            value={name}
            className=""
            onChange={(ev) => setName(ev.target.value)}
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            className=""
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            valu={password}
            className=""
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="primary">Sign Up</button>
          <div className="py-4 text-center text-gray-500">
            Already a Member?
            <Link to="/login" className="text-sky-600 m-4 underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
