import SideBar from "@/components/Sidebar/sidebar";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="min-h-[100svh]  flex items-center justify-center antialiased text-slate-100 selection:bg-red-500 selection:text-white">
      <div className="w-full  h-[100svh] p-3 gap-4 border border-white/60 flex flex-col md:flex-row  overflow-hidden">
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
}
