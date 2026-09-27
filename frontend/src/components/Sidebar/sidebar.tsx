import {
  Film,
  Home,
  Search,
  Settings,
  Tv,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

const mainNav: NavItem[] = [
  {
    label: "Home",
    path: "/",
    icon: Home,
  },
  {
    label: "Search",
    path: "/search",
    icon: Search,
  },
  {
    label: "TV Shows",
    path: "/tv",
    icon: Tv,
  },
  {
    label: "Movies",
    path: "/movies",
    icon: Film,
  },
];

const bottomNav: NavItem[] = [
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const SideBar = () => {
  return (
    <aside className="w-full md:w-20 bg-[#121316] rounded-[18px] py-5 px-3 flex md:flex-col items-center justify-between shrink-0 shadow-xl">
      {/* Logo */}
      <div className="flex flex-col items-center gap-6">
        <NavLink
          to="/"
          className="w-12 h-12  overflow-hidden flex items-center justify-center shadow-lg shadow-red-900/40 hover:scale-105 transition-transform duration-300"
        >
          <img
            src="https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Netflix_icon.svg/500px-Netflix_icon.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail"
            alt="Netflix"
            className="h-full w-full object-cover rounded-xl"
          />
        </NavLink>

        {/* Main Navigation */}
        <nav className="hidden md:flex flex-col items-center gap-5 w-full">
          {mainNav.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              title={label}
              end={path === "/"}
              className={({ isActive }) =>
                `p-3 rounded-2xl transition-all duration-300 relative ${
                  isActive
                    ? "bg-neutral-800/90 text-white shadow-inner shadow-white/10"
                    : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/40"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" />

                  {isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-red-500 rounded-l-full shadow-[0_0_8px_#ef4444]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Settings + Profile */}
      <div className="flex md:flex-col items-center gap-6">
        <nav className="hidden md:flex flex-col items-center gap-3 w-full">
          {bottomNav.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              title={label}
              className={({ isActive }) =>
                `p-3 rounded-2xl transition-all duration-300 relative ${
                  isActive
                    ? "bg-neutral-800/90 text-white shadow-inner shadow-white/10"
                    : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/40"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" />

                  {isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-red-500 rounded-l-full shadow-[0_0_8px_#ef4444]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profile */}
        <NavLink to="/profile" className="relative group cursor-pointer">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaCoIm048103kzcsGy9Ytxp4DG-A0g7r2a1BvlfvklGONNJXg5wU3fSII&s=10"
            alt="User Profile"
            className="w-10 h-10 rounded-2xl object-cover border-2 border-neutral-700 group-hover:border-white transition-colors shadow-md"
          />

          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-neutral-900" />
        </NavLink>
      </div>
    </aside>
  );
};

export default SideBar;
