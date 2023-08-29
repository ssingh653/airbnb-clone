import axios from "axios";
import { React, useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  async function onLogin(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post("/login", { email, password });
      // console.log(data);
      setRedirect(true);
      setUser(data);
    } catch (e) {
      alert("Login failed");
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="p-2 text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto " onSubmit={onLogin}>
          <input
            type="email"
            placeholder="your@email.com"
            className=""
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="password"
            className=""
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button className="primary">Login</button>
          <div className="py-4 text-center text-gray-500">
            Don't have an account?
            <Link to="/register" className="text-sky-600 m-4 underline">
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
