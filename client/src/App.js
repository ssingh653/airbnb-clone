import "./App.css";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import LoginPage from "./pages/loginPage";
import Layout from "./components/Layout";
import Register from "./pages/registerPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import Account from "./pages/Account";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
}
axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "https://airbnb-clone-app-r59g.onrender.com"
    : "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account/:subpage?" element={<Account />} />
          <Route path="/account/:subpage/:action?" element={<Account />} />
          <Route path="/account/:subpage/:id?" element={<Account />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
