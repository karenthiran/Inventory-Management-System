import {
  LayoutGrid,
  Box,
  FolderKanban,
  ArrowRight,
  ArrowLeft,
  Wrench,
  Users,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Home", icon: LayoutGrid, active: true },
    { name: "Inventory Item", icon: Box },
    { name: "Categories", icon: FolderKanban },
    { name: "Issue", icon: ArrowRight },
    { name: "Return", icon: ArrowLeft },
    { name: "Maintenance", icon: Wrench },
    { name: "User", icon: Users },
    { name: "Setting", icon: Settings },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-100 p-6">
      {/* Title */}
      <h2 className="text-gray-700 text-lg font-medium mb-8">Navigation Bar</h2>

      {/* Menu */}
      <div className="space-y-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className={`flex items-center gap-4 px-5 py-3 rounded-2xl cursor-pointer transition-all duration-300
                ${
                  item.active
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
            >
              <Icon size={20} />
              <span className="text-base font-medium">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
