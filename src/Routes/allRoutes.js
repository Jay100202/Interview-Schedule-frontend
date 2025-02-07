import React from "react";
import { Navigate } from "react-router-dom";

import Login from "../pages/Authentication/Login";

import InterviewScheduler from "../pages/Setup/InterviewScheduler";
import Register from "../pages/Authentication/Register";
import ProfileDropdown from "../Components/Common/ProfileDropdown";
const authProtectedRoutes = [
  // { path: "/dashboard", component: <DashboardCrm /> },
  { path: "/Dashboard", component: <InterviewScheduler /> },
  {path: "/profile", component: <ProfileDropdown />},
 
];

const publicRoutes = [
  // \{ path: "/dashboard", component: <DashboardCrm /> },
  { path: "/", component: <Login /> },
  {path: "/register", component: <Register />},
];

export { authProtectedRoutes, publicRoutes };
