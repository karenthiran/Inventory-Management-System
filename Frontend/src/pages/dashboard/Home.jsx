import React from "react";

const Home = () => {
  const user = {
    name: "Anton",
    role: "admin",
  };

  const isAdmin = user.role === "admin";

  return (
    <>
      {/* Welcome Section */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Welcome, {user.name} 👋
      </h2>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <SummaryCard title="Total Items" value="245" />
        <SummaryCard title="Issued Items" value="58" />
        <SummaryCard title="Available Items" value="167" />

        {isAdmin && (
          <SummaryCard title="Damaged Items" value="20" color="red" />
        )}
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      {isAdmin && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton label="Add Item" />
            <ActionButton label="Issue Item" />
            <ActionButton label="Return Item" />
            <ActionButton label="Generate Report" />
          </div>
        </div>
      )}

      {/* ================= RECENT ACTIVITY ================= */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Activity
        </h3>

        <div className="bg-white shadow rounded-2xl overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  Item
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  Action
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  User
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              <tr>
                <td className="px-6 py-4">2026-01-12</td>
                <td className="px-6 py-4">Arduino Kit</td>
                <td className="px-6 py-4">Issued</td>
                <td className="px-6 py-4">Student A</td>
                <td className="px-6 py-4 text-blue-600 font-medium">Active</td>
              </tr>

              <tr>
                <td className="px-6 py-4">2026-01-11</td>
                <td className="px-6 py-4">Oscilloscope</td>
                <td className="px-6 py-4">Returned</td>
                <td className="px-6 py-4">Lecturer B</td>
                <td className="px-6 py-4 text-green-600 font-medium">
                  Returned
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4">2026-01-10</td>
                <td className="px-6 py-4">Raspberry Pi</td>
                <td className="px-6 py-4">Damaged</td>
                <td className="px-6 py-4">Student C</td>
                <td className="px-6 py-4 text-red-600 font-medium">Damaged</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

/* ================= COMPONENTS ================= */

const SummaryCard = ({ title, value, color = "blue" }) => {
  const colors = {
    blue: "border-blue-500",
    red: "border-red-500",
  };

  return (
    <div
      className={`bg-white shadow-lg rounded-2xl p-6 border-l-4 ${colors[color]}`}
    >
      <h4 className="text-gray-600 text-sm">{title}</h4>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
};

const ActionButton = ({ label }) => (
  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl shadow transition duration-200 px-4">
    {label}
  </button>
);

export default Home;
