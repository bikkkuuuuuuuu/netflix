import SideBar from "@/components/Sidebar/sidebar";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="h-dvh w-full overflow-hidden antialiased text-slate-100 selection:bg-red-500 selection:text-white">
      <div className="flex h-full w-full min-h-0 flex-col gap-4 overflow  md:flex-row px-3 pt-3">
        <SideBar />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
