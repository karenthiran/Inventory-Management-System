import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  FileCheck,
  LayoutGrid,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";

import DashboardCard from "../components/common/DashboardCard";
import HomeDataTable from "../components/layout/home/HomeDataTable";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const columns = [
  { header: "Item Id", accessor: "itemId" },
  { header: "Item Name", accessor: "itemName" },
  { header: "User Name", accessor: "userName" },
  { header: "Due Date", accessor: "dueDate" },
];

const Home = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [issuedCount, setIssuedCount] = useState(0);
  const [activeMaintenanceCount, setActiveMaintenanceCount] = useState(0);
  const [dueSoonItems, setDueSoonItems] = useState([]);
  const [overDueItems, setOverDueItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, issuesRes, activeCodesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/inventory/all`),
          fetch(`${API_BASE_URL}/api/issues/all`),
          fetch(`${API_BASE_URL}/api/maintenance/active-codes`),
        ]);

        const inventory = await inventoryRes.json();
        const issues = await issuesRes.json();
        const activeCodes = await activeCodesRes.json();

        // ✅ Total items in inventory table
        setTotalItems(inventory.length);

        // ✅ Only un-returned issued items
        const activeIssues = issues.filter((i) => !i.isReturned);
        setIssuedCount(activeIssues.length);

        // ✅ Active maintenance count
        setActiveMaintenanceCount(activeCodes.length);

        // ✅ Due Soon — active issues due within 3 days (not returned)
        const today = new Date().setHours(0, 0, 0, 0);
        const dueSoon = activeIssues
          .filter((i) => {
            const d = (new Date(i.expectedReturnDate) - today) / 86400000;
            return d >= 0 && d <= 3;
          })
          .map((i) => ({
            itemId: i.itemCodesSnapshot || "N/A",
            itemName: i.itemName,
            userName: i.issuedTo?.username || i.issuedTo?.email || "N/A",
            dueDate: i.expectedReturnDate,
          }));
        setDueSoonItems(dueSoon);

        // ✅ Overdue — active issues past due date (not returned)
        const overdue = activeIssues
          .filter(
            (i) => new Date(i.expectedReturnDate).setHours(0, 0, 0, 0) < today,
          )
          .map((i) => ({
            itemId: i.itemCodesSnapshot || "N/A",
            itemName: i.itemName,
            userName: i.issuedTo?.username || i.issuedTo?.email || "N/A",
            dueDate: i.expectedReturnDate,
          }));
        setOverDueItems(overdue);
      } catch (err) {
        console.error("Home fetch error:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Available = Total - Issued (un-returned) - Active Maintenance
  const availableCount = totalItems - issuedCount - activeMaintenanceCount;

  const cardData = [
    {
      title: "Total Items",
      value: totalItems.toString(),
      subtitle: "Total inventory items",
      icon: <Package size={20} />,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Issued Items",
      value: issuedCount.toString(),
      subtitle: "Currently in use",
      icon: <ArrowRight size={20} />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Available Items",
      value: Math.max(0, availableCount).toString(),
      subtitle: "Ready to issue",
      icon: <FileCheck size={20} />,
      gradient: "from-emerald-500 to-green-600",
    },
  ];

  return (
    <div className='h-full flex flex-col px-6 py-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-10'>
        <div className='bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg'>
          <LayoutGrid
            size={22}
            className='text-indigo-600 dark:text-indigo-400'
          />
        </div>
        <h1 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
          Overview
        </h1>
      </div>

      {/* Cards */}
      <section className='flex justify-center mb-14'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl'>
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </section>

      {/* Tables */}
      <section className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
          {/* Due Soon */}
          <div>
            <div className='flex items-center gap-3 mb-5'>
              <div className='bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg'>
                <CalendarClock
                  size={18}
                  className='text-indigo-600 dark:text-indigo-400'
                />
              </div>
              <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
                Due Soon
              </h2>
            </div>
            <HomeDataTable columns={columns} data={dueSoonItems} />
          </div>

          {/* Overdue */}
          <div>
            <div className='flex items-center gap-3 mb-5'>
              <div className='bg-red-100 dark:bg-red-900/40 p-2 rounded-lg'>
                <AlertTriangle
                  size={18}
                  className='text-red-600 dark:text-red-400'
                />
              </div>
              <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
                Overdue
              </h2>
            </div>
            <HomeDataTable columns={columns} data={overDueItems} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
