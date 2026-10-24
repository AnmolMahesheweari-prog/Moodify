import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./Feature/Auth/pages/Login";
import Register from "./Feature/Auth/pages/Register";
import FaceExpression from "./Feature/expression/pages/FaceExpression";

function AuthRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<FaceExpression />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AuthRoute;
