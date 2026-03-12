import { CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmModal from "../../common/ConfirmModal";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const ItemTypeSettings = () => {
  const [itemTypes, setItemTypes] = useState([]);
  // Updated keys to match Spring Boot Model (typeId, typeName)
  const [form, setForm] = useState({ typeId: "", typeName: "" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [successToast, setSuccessToast] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    fetchItemTypes();
  }, []);

  const fetchItemTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/itemtypes/all`);
      if (response.ok) {
        const data = await response.json();
        setItemTypes(data);
      }
    } catch (error) {
      console.error("Error fetching item types:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message) => {
    setSuccessToast({ show: true, message });
    setTimeout(() => setSuccessToast({ show: false, message: "" }), 3000);
  };

  const handleSave = async () => {
    if (!form.typeId || !form.typeName) return;
    setIsSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/itemtypes/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        fetchItemTypes();
        showToast("Item type added successfully!");
        resetForm();
      } else {
        const errorMsg = await response.text(); // Catching the RuntimeException message
        alert(errorMsg || "Failed to save.");
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const id = deleteModal.id;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/itemtypes/delete/${id}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setItemTypes(itemTypes.filter((item) => item.typeId !== id));
        showToast("Item type deleted successfully!");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  const resetForm = () => {
    setForm({ typeId: "", typeName: "" });
    setShowForm(false);
    setIsSaving(false);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="space-y-6 relative">
      {/* SUCCESS TOAST */}
      {successToast.show && (
        <div className="fixed top-5 right-5 z-[110] flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-in slide-in-from-right-full">
          <CheckCircle2 size={20} />
          <span className="font-medium">{successToast.message}</span>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Item Type"
        message="Are you sure? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        confirmText="Delete"
        isDanger={true}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Item Type Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} /> Add Item Type
        </button>
      </div>

      <div className="flex gap-6">
        {/* TABLE */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800 text-center">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold">Type ID</th>
                <th className="px-6 py-3 text-sm font-semibold">Type Name</th>
                <th className="px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-10 text-center">
                    <Loader2 className="animate-spin mx-auto text-indigo-600" />
                  </td>
                </tr>
              ) : itemTypes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-gray-400">
                    No item types found
                  </td>
                </tr>
              ) : (
                itemTypes.map((item) => (
                  <tr
                    key={item.typeId}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800 text-center"
                  >
                    <td className="px-6 py-3 font-mono text-xs">
                      {item.typeId}
                    </td>
                    <td className="px-6 py-3">{item.typeName}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() =>
                          setDeleteModal({ isOpen: true, id: item.typeId })
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ADD FORM */}
        {showForm && (
          <div className="w-96 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4">Add New Item Type</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Item Type ID</label>
                <input
                  placeholder="eg:- IT-001"
                  value={form.typeId}
                  onChange={(e) => setForm({ ...form, typeId: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Item Type Name</label>
                <input
                  placeholder="eg:- Consumable"
                  value={form.typeName}
                  onChange={(e) =>
                    setForm({ ...form, typeName: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-white 
                    ${isSaving ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Save"
                  )}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition"
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
