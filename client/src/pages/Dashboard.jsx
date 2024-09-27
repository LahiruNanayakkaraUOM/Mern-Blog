import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/DashSidebar";
import Profile from "./Profile";
import Posts from "./Posts";
import Users from "./Users";
import DashComments from "./DashComments";
import DashOverview from "./DashOverview";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <Sidebar />
      </div>
      <div className="w-full">
        {tab === "profile" && <Profile className="" />}
        {tab === "posts" && <Posts className="" />}
        {tab === "users" && <Users className="" />}
        {tab === "comments" && <DashComments className="" />}
        {(tab === "overview" || tab == "") && <DashOverview className="" />}
      </div>
    </div>
  );
}
