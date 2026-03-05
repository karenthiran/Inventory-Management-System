import React, { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

const CategorySettings = () => {
  const [categories, setCategories] = useState([
    { id: "C-ID-001", name: "Electronic" },
  ]);

  const [form, setForm] = useState({ id: "", name: "" });
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  const handleSave = () => {
    if (!form.id || !form.name) return;

    if (editIndex !== null) {
      const updated = [...categories];
      updated[editIndex] = form;
      setCategories(updated);
      setEditIndex(null);
    } else {
      setCategories([...categories, form]);
    }

    setForm({ id: "", name: "" });
    setShowForm(false);
  };

  const handleDelete = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Category Management</h2>

        <button
          onClick={() => {
            setShowForm(true);
            setEditIndex(null);
            setForm({ id: "", name: "" });
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex gap-6">
        {/* TABLE */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800 text-center">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold">Category ID</th>
                <th className="px-6 py-3 text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-gray-400">
                    No categories added
                  </td>
                </tr>
              ) : (
                categories.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-center"
                  >
                    <td className="px-6 py-3">{item.id}</td>
                    <td className="px-6 py-3">{item.name}</td>

                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => {
                            setForm(item);
                            setEditIndex(index);
                            setShowForm(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <Pencil size={18} />
                        </button>

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
            <h3 className="text-lg font-semibold mb-4">
              {editIndex !== null ? "Update Category" : "Add Category"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Category ID</label>
                <input
                  placeholder=" Category ID "
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Category Name</label>
                <input
                  placeholder="Enter Category Name "
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
                    setEditIndex(null);
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

export default CategorySettings;
