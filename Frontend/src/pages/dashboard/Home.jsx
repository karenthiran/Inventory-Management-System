import React from "react";

const Home = () => {
  return (
    <div className="space-y-8">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-semibold text-gray-700 tracking-wide">
        HOME
      </h1>

      {/* ===================== SUMMARY CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Items"
          value="1245"
          subtitle="+12.5% from last month"
          gradient="from-blue-500 to-indigo-600"
        />

        <StatCard
          title="Issued Items"
          value="487"
          subtitle="Currently in use"
          gradient="from-pink-500 to-rose-500"
        />

        <StatCard
          title="Available"
          value="758"
          subtitle="Ready to issue"
          gradient="from-green-500 to-emerald-600"
        />

        <StatCard
          title="Low Stock"
          value="23"
          subtitle="Requires attention"
          gradient="from-orange-500 to-red-500"
        />
      </div>

      {/* ===================== LOW STOCK & DAMAGED ===================== */}
      <div className="bg-gray-100 p-6 rounded-2xl shadow-inner max-w-xl">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800">Low Stock & Damaged</h3>
          <p className="text-sm text-gray-500">Items requiring attention</p>
        </div>

        <div className="space-y-4">
          <ItemRow name='Dell Monitor 24"' qty="5" status="low" />
          <ItemRow name="HP Keyboard" qty="2" status="damaged" />
          <ItemRow name="Logitech Mouse" qty="5" status="low" />
          <ItemRow name="USB-C Cable" qty="4" status="low" />
        </div>
      </div>
    </div>
  );
};

/* ===================== COMPONENTS ===================== */

const StatCard = ({ title, value, subtitle, gradient }) => {
  return (
    <div
      className={`rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br ${gradient}`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
      <p className="text-xs mt-2 opacity-80">{subtitle}</p>
    </div>
  );
};

const ItemRow = ({ name, qty, status }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
      <div>
        <p className="text-sm font-medium text-gray-800">{name}</p>
        <p className="text-xs text-gray-500">Quantity: {qty}</p>
      </div>

      {status === "low" && (
        <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
          Low Stock
        </span>
      )}

      {status === "damaged" && (
        <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
          Damaged
        </span>
      )}
    </div>
  );
};

export default Home;
