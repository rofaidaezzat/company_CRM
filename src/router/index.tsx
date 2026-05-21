import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router";
import Deals from "../pages/Deals";
import Leads from "../pages/Leads";
import Reports from "../pages/Reports";
import Search_Results from "../pages/Search_Results";
import Settings from "../pages/Settings";
import Layout from "../components/Layout";
import Sales from "../pages/Sales";

import Login from "../pages/Login";
import Reset_Password from "../pages/Reset_Password";
import OTP_Verification from "../pages/OTP_Verification";
import Update_Password from "../pages/Update_Password";
import Overview from "../pages/Overview";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/search" element={<Search_Results />} />
        <Route path="/settings" element={<Settings />} />
    
        <Route path="/sales" element={<Sales />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<Reset_Password />} />
      <Route path="/otp-verification" element={<OTP_Verification />} />
      <Route path="/update-password" element={<Update_Password />} />
    </>
  )
);