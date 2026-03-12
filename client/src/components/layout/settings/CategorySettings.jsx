import { CheckCircle2, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmModal from "../../common/ConfirmModal";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const CategorySettings = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ categoryId: "", categoryName: "" });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal & Toast States
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [successToast, setSuccessToast] = useState({
    show: false,
    message: "",
  });

  const [isSaving, setIsSaving] = useState(false); // To prevent multiple clicks on save/update

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/all`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message) => {
    setSuccessToast({ show: true, message });
    setTimeout(() => setSuccessToast({ show: false, message: "" }), 3000);
  };

  const handleSave = async () => {
    if (!form.categoryId || !form.categoryName) return;

    // 1. Disable button immediately
    setIsSaving(true);

    const url = isEditing
      ? `${API_BASE_URL}/api/categories/update/${form.categoryId}`
      : `${API_BASE_URL}/api/categories/add`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        fetchCategories();
        showToast(
          isEditing
            ? "Category updated successfully!"
            : "Category added successfully!",
        );
        resetForm();
      } else {
        // Handle server errors (e.g., 400, 500)
        console.error("Server error during save");
      }
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      // 2. THIS IS THE KEY: Re-enable the button no matter what happens
      setIsSaving(false);
    }
  };

  // Triggered when user clicks trash icon
  const openDeleteConfirm = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  // Triggered when user confirms inside the ConfirmModal
  const handleDelete = async () => {
    const id = deleteModal.id;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/categories/delete/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setCategories(categories.filter((cat) => cat.categoryId !== id));
        showToast("Category deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  const resetForm = () => {
    setForm({ categoryId: "", categoryName: "" });
    setShowForm(false);
    setIsEditing(false);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className='space-y-6 relative'>
      {/* SUCCESS TOAST POPUP */}
      {successToast.show && (
        <div className='fixed top-5 right-5 z-110 flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-in slide-in-from-right-full'>
          <CheckCircle2 size={20} />
          <span className='font-medium'>{successToast.message}</span>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title='Delete Category'
        message='Are you sure you want to delete this category? This action cannot be undone.'
        onConfirm={handleDelete}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        confirmText='Delete'
        isDanger={true}
      />

      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Category Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm'
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className='flex gap-6'>
        {/* TABLE */}
        <div className='flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden'>
          <table className='w-full'>
            <thead className='bg-gray-50 dark:bg-slate-800 text-center'>
              <tr>
                <th className='px-6 py-3 text-sm font-semibold'>Category ID</th>
                <th className='px-6 py-3 text-sm font-semibold'>Name</th>
                <th className='px-6 py-3 text-sm font-semibold'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 dark:divide-slate-700'>
              {loading ? (
                <tr>
                  <td colSpan='3' className='py-10 text-center'>
                    <Loader2 className='animate-spin mx-auto' />
                  </td>
                </tr>
              ) : (
                categories.map((item) => (
                  <tr
                    key={item.categoryId}
                    className='hover:bg-gray-50 dark:hover:bg-slate-800 text-center'
                  >
                    <td className='px-6 py-3 font-mono text-xs'>
                      {item.categoryId}
                    </td>
                    <td className='px-6 py-3'>{item.categoryName}</td>
                    <td className='px-6 py-3'>
                      <div className='flex justify-center items-center gap-3'>
                        <button
                          onClick={() => {
                            setForm(item);
                            setIsEditing(true);
                            setShowForm(true);
                          }}
                          className='text-indigo-600 hover:text-indigo-800'
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(item.categoryId)}
                          className='text-red-500 hover:text-red-700'
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
          <div className='w-96 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 h-fit'>
            <h3 className='text-lg font-semibold mb-4'>
              {isEditing ? "Update Category" : "Add Category"}
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='text-sm text-gray-500'>Category ID</label>
                <input
                  disabled={isEditing}
                  placeholder='eg:- CAT001'
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className={`${inputClass} ${isEditing ? "opacity-50" : ""}`}
                />
              </div>
              <div>
                <label className='text-sm text-gray-500'>Category Name</label>
                <input
                  value={form.categoryName}
                  placeholder='eg:- Sensors'
                  onChange={(e) =>
                    setForm({ ...form, categoryName: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className='flex gap-3 pt-2'>
                <button
                  onClick={handleSave}
                  disabled={isSaving} // Prevents multiple clicks
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-white transition-all 
                  ${isSaving ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"}`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className='animate-spin' />
                      {isEditing ? "Updating..." : "Saving..."}
                    </>
                  ) : isEditing ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </button>
                <button
                  onClick={resetForm}
                  className='flex-1 border border-gray-300 py-2 rounded-lg'
                >
                  {" "}
                  Cancel{" "}
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
