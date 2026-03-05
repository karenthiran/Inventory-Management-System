import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";

const ItemTypeSettings = () => {
  const [itemTypes, setItemTypes] = useState([
    { id: "IT-ID-001", name: "Consumable" },
  ]);

  const [form, setForm] = useState({ id: "", name: "" });
  const [showForm, setShowForm] = useState(false);

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  const handleSave = () => {
    if (!form.id || !form.name) return;

    setItemTypes([...itemTypes, form]);

    setForm({ id: "", name: "" });
    setShowForm(false);
  };

  const handleDelete = (index) => {
    setItemTypes(itemTypes.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Item Type Management</h2>

        <button
          onClick={() => {
            setShowForm(true);
            setForm({ id: "", name: "" });
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          <Plus size={16} />
          Add Item Type
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex gap-6">
        {/* TABLE */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800 text-center">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold">
                  Item Type ID
                </th>
                <th className="px-6 py-3 text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {itemTypes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-gray-400">
                    No item types added
                  </td>
                </tr>
              ) : (
                itemTypes.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <td className="px-6 py-3 text-center">{item.id}</td>

                    <td className="px-6 py-3 text-center">{item.name}</td>

                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="w-96 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4">Add Item Type</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Item Type ID</label>
                <input
                  placeholder="Enter Item type ID"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Item Type Name</label>
                <input
                  placeholder="Enter Item type Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setShowForm(false);
                    setForm({ id: "", name: "" });
                  }}
                  className="flex-1 border border-gray-300 dark:border-slate-600 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemTypeSettings;
