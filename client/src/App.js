import "./App.css";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import LoginPage from "./pages/loginPage";
import Layout from "./components/Layout";
import YourHome from "./pages/yourhome";
import Register from "./pages/registerPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import Account from "./pages/Account";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/yourhome" element={<YourHome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account/:subpage?" element={<Account />} />
          <Route path="/account/:subpage/:action?" element={<Account />} />
          {/* <Route path="/logout" /> */}
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
