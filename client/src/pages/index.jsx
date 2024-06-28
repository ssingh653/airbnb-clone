import { React, lazy, Suspense } from "react";
// import { Link } from "react-router-dom";
// import Properties from "../components/Properties.jsx";
import Loading from "../components/Loading.jsx";
const Properties = lazy(() => import("../components/Properties.jsx"));
const index = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Properties />
    </Suspense>
  );
};

export default index;
