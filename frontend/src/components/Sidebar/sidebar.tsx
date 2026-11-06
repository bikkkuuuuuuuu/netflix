import { AuthContext } from "@/context/auth-context";
import { UserType } from "@/services/auth.service";
import {
  Activity,
  ChartNoAxesCombined,
  Film,
  Home,
  LayoutDashboard,
  Search,
  Settings,
  Tv,
  HardDrive,
  Workflow,
  Upload,
  Users,
  AudioLines,
  type LucideIcon,
  User,
} from "lucide-react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";

// Replace this import with your actual authentication hook.

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

const adminNav: NavItem[] = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Upload Studio",
    path: "/upload",
    icon: Upload,
  },
  {
    label: "Library",
    path: "/library",
    icon: Film,
  },
  {
    label: "Activity Logs",
    path: "/activity",
    icon: Activity,
  },
  {
    label: "Analytics",
    path: "/anal",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Users",
    path: "/users",
    icon: Users,
  },
  {
    label: "Storage",
    path: "/storage",
    icon: HardDrive,
  },
  {
    label: "Workers",
    path: "/workers",
    icon: Workflow,
  },
  {
    label: "Playback",
    path: "/playback",
    icon: AudioLines,
  },
];

const bottomNav: NavItem[] = [
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

type NavigationItemProps = {
  item: NavItem;
};

const NavigationItem = ({ item }: NavigationItemProps) => {
  const { label, path, icon: Icon } = item;

  return (
    <NavLink
      to={path}
      title={label}
      end={path === "/" || path === "/admin"}
      className={({ isActive }) =>
        `p-3 rounded-2xl transition-all duration-300 relative group ${
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

          {/* Tooltip */}
          <span className="absolute left-full ml-4 px-3 py-2 rounded-lg bg-neutral-800 text-white text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
};

const SideBar = () => {
  const { loggedInUser } = useContext(AuthContext) as {
    loggedInUser: UserType | null;
    isLoading: boolean;
  };
  const isAdmin = loggedInUser && loggedInUser?.role === "admin";

  return (
    <aside className="w-full md:w-20 bg-[#121316] rounded-[18px] py-5 px-3 flex md:flex-col items-center justify-between shrink-0 shadow-xl">
      {/* Logo + Navigation */}
      <div className="flex flex-col items-center gap-6">
        <NavLink
          to="/"
          className="w-12 h-12 overflow-hidden flex items-center justify-center shadow-lg shadow-red-900/40 hover:scale-105 transition-transform duration-300"
        >
          <img
            src="/images/logo.png"
            alt="Netflix"
            className="h-full w-full object-cover rounded-xl"
          />
        </NavLink>

        {/* Main Navigation */}
        {isAdmin ? (
          <></>
        ) : (
          <nav className="hidden md:flex flex-col items-center gap-5 w-full">
            {mainNav.map((item) => (
              <NavigationItem key={item.path} item={item} />
            ))}
          </nav>
        )}

        {/* Admin Navigation */}
        {isAdmin && (
          <div className="hidden md:flex flex-col items-center gap-3 w-full">
            <nav className="flex flex-col items-center gap-3 w-full">
              {adminNav.map((item) => (
                <NavigationItem key={item.path} item={item} />
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Settings + Profile */}
      <div className="flex md:flex-col items-center gap-6">
        <nav className="hidden md:flex flex-col items-center gap-3 w-full">
          {bottomNav.map((item) => (
            <NavigationItem key={item.path} item={item} />
          ))}
        </nav>

        {loggedInUser ? (
          <NavLink
            to="/profile"
            title="Profile"
            className="relative group cursor-pointer"
          >
            <img
              src={
                loggedInUser?.image ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaCoIm048103kzcsGy9Ytxp4DG-A0g7r2a1BvlfvklGONNJXg5wU3fSII&s=10"
              }
              alt="User Profile"
              className="w-10 h-10 rounded-2xl object-cover border-2 border-neutral-700 group-hover:border-white transition-colors shadow-md"
            />

            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-neutral-900" />
          </NavLink>
        ) : (
          <NavLink
            to="/auth/login"
            title="Login"
            className="p-3 rounded-2xl text-neutral-500 hover:text-white hover:bg-neutral-800/40 transition-colors"
          >
            <User className="w-5 h-5" />
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
