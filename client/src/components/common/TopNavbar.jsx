// import { Bell, LogOut, Search } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import ThemeToggle from "./ThemeToggle";

// const Topbar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const routeTitles = {
//     "/home": "Home",
//     "/inventory": "Inventory Item",
//     "/issue": "Issue",
//     "/return": "Return",
//     "/maintenance": "Maintenance",
//     "/report": "Reports",
//     "/setting": "Settings",
//     "/userprofile": "User Profile",
//   };

//   const title = routeTitles[location.pathname] || "Dashboard";

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // remove token if stored
//     localStorage.removeItem("user"); // remove user data if stored
//     navigate("/"); // redirect to Login page
//   };

//   return (
//     <div
//       className="fixed top-0 left-64 right-0 h-16
//                     bg-gray-100 dark:bg-gray-800
//                     px-8 flex items-center justify-between
//                     border-b border-gray-300 dark:border-gray-700
//                     z-40"
//     >
//       {/* Dynamic Title */}
//       <h1
//         className="text-2xl font-semibold
//                      text-indigo-600 dark:text-white"
//       >
//         {title}
//       </h1>

//       {/* Right Section */}
//       <div className="flex items-center gap-6">
//         {/* Search Bar */}
//         <div className="relative">
//           <Search
//             size={18}
//             className="absolute left-3 top-1/2 -translate-y-1/2
//                        text-gray-400 dark:text-gray-300"
//           />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-72 bg-gray-100 dark:bg-gray-700
//                        rounded-lg py-2 pl-10 pr-4 text-sm
//                        text-black dark:text-white
//                        outline outline-gray-300 dark:outline-gray-600
//                        focus:ring-2 focus:ring-indigo-300"
//           />
//         </div>

//         <Bell size={20} className="text-indigo-500 cursor-pointer" />

//         {/*  Theme Toggle Here */}
//         <ThemeToggle />
//         {/* ✅ Logout Click */}
//         <LogOut
//           size={20}
//           className="text-red-500 cursor-pointer"
//           onClick={handleLogout}
//         />
//       </div>
//     </div>
//   );
// };

// export default Topbar;
import { Bell, LogOut, Search, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Item Issued",
      message: "Laptop Dell issued to Lab 02",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Low Stock Warning",
      message: "Mouse inventory is running low",
      time: "10 min ago",
      unread: true,
    },
    {
      id: 3,
      title: "Maintenance",
      message: "Projector scheduled for maintenance",
      time: "1 hour ago",
      unread: false,
    },
  ]);

  const notificationRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const routeTitles = {
    "/dashboard/home": "Home",
    "/dashboard/inventory": "Inventory Item",
    "/dashboard/issue": "Issue",
    "/dashboard/return": "Return",
    "/dashboard/maintenance": "Maintenance",
    "/dashboard/report": "Reports",
    "/dashboard/setting": "Settings",
    "/dashboard/userprofile": "User Profile",
  };

  const title = routeTitles[location.pathname] || "Dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Mark notification as read */
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  /* Delete single notification */
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  /* Clear all notifications */
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div
      className="fixed top-0 left-64 right-0 h-16 
    bg-gray-100 dark:bg-gray-900
    px-8 flex items-center justify-between
    border-b border-gray-300 dark:border-gray-700 z-40"
    >
      {/* Title */}
      <h1 className="text-2xl font-semibold text-indigo-600 dark:text-white">
        {title}
      </h1>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 bg-gray-200 dark:bg-gray-800
            rounded-lg py-2 pl-10 pr-4 text-sm
            text-gray-800 dark:text-gray-200
            border border-gray-300 dark:border-gray-700
            outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Notification */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell
              size={20}
              className="text-indigo-500 hover:scale-110 transition"
            />

            {unreadCount > 0 && (
              <span
                className="absolute -top-2 -right-2
              bg-red-500 text-white text-xs
              w-4 h-4 flex items-center justify-center rounded-full"
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifications && (
            <div
              className="absolute right-0 mt-4 w-96
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            rounded-xl shadow-2xl overflow-hidden animate-fadeIn"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-5 py-3 border-b dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Notifications
                </h3>

                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="text-center text-sm text-gray-500 py-8">
                    No notifications
                  </p>
                )}

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className="flex justify-between items-start
                    px-5 py-4 hover:bg-gray-100 dark:hover:bg-gray-800
                    cursor-pointer transition"
                  >
                    <div className="flex gap-3">
                      {/* Unread dot */}
                      {n.unread && (
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></span>
                      )}

                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {n.title}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {n.message}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>

                    {/* Delete button */}
                    <X
                      size={16}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n.id);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <ThemeToggle />

        <LogOut
          size={20}
          className="text-red-500 cursor-pointer hover:scale-110 transition"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Topbar;
