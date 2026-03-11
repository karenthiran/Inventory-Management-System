import axios from "axios";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ConfirmModal from "../../common/ConfirmModal";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const UserSettings = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // For Add/Update
  const [isDeleting, setIsDeleting] = useState(false); // For Deletion
  const [fetchLoading, setFetchLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "",
    password: "User@123",
  });

  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});

  const inputClass =
    "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all";

  const fetchUsers = async () => {
    setFetchLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/all`);
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Could not load users.");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const requestDelete = (username) => {
    if (isDeleting) return; // Prevent opening modal if already deleting
    setUserToDelete(username);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${userToDelete}`);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.username !== userToDelete),
      );
      toast.success(`User ${userToDelete} removed.`);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Delete error:", err.response); // Add this to debug
      const message = err.response?.data || "Failed to delete user.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };
  const handleSave = async () => {
    if (loading) return; // Prevent double submit

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/users/register`, form);
      await fetchUsers();
      toast.success("User saved successfully!");
      handleCancel();
    } catch (err) {
      const message = err.response?.data || "Failed to save user.";
      toast.error(message);
      setErrors({ server: message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    setShowForm(false);
    setEditIndex(null);
    setForm({
      username: "",
      email: "",
      role: "",
      password: "User@123",
    });
    setErrors({});
  };

  return (
    <div className='space-y-6 font-[Poppins]'>
      <Toaster position='top-right' reverseOrder={false} />

      <ConfirmModal
        isOpen={isModalOpen}
        title='Confirm Deletion'
        message={`Are you sure you want to remove ${userToDelete}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onClose={() => !isDeleting && setIsModalOpen(false)} // Prevent close while deleting
        confirmText={isDeleting ? "Deleting..." : "Delete User"}
        isDanger={true}
        loading={isDeleting}
      />

      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>User Management</h2>
        <button
          onClick={() => setShowForm(true)}
          disabled={loading || isDeleting}
          className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className='flex gap-6'>
        <div className='flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden'>
          <table className='w-full'>
            <thead className='bg-gray-50 dark:bg-slate-800 text-center'>
              <tr>
                <th className='px-6 py-3 text-sm font-semibold'>Username</th>
                <th className='px-6 py-3 text-sm font-semibold'>Email</th>
                <th className='px-6 py-3 text-sm font-semibold'>Role</th>
                <th className='px-6 py-3 text-sm font-semibold text-center'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {fetchLoading ? (
                <tr>
                  <td colSpan='4' className='py-10 text-center'>
                    <Loader2 className='animate-spin mx-auto text-indigo-500' />
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.username}
                    className='border-t border-gray-200 dark:border-slate-700'
                  >
                    <td className='px-6 py-3 text-center'>{user.username}</td>
                    <td className='px-6 py-3 text-center'>{user.email}</td>
                    <td className='px-6 py-3 text-center'>
                      <span className='px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 uppercase font-bold'>
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-3 text-center'>
                      <button
                        onClick={() => requestDelete(user.username)}
                        disabled={isDeleting || loading}
                        className='p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30'
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

        {showForm && (
          <div className='w-96 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 h-fit animate-in fade-in slide-in-from-right-2'>
            <h3 className='text-lg font-semibold mb-4'>
              {editIndex !== null ? "Update User" : "Add User"}
            </h3>

            {errors.server && (
              <p className='text-red-500 text-xs mb-3 italic'>
                {errors.server}
              </p>
            )}

            <div className='space-y-4'>
              <div>
                <label className='text-sm text-gray-500 block mb-1'>
                  Username
                </label>
                <input
                  disabled={loading}
                  placeholder='Enter username'
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  className={`${inputClass} ${loading && "opacity-50"}`}
                />
              </div>

              <div>
                <label className='text-sm text-gray-500 block mb-1'>
                  Email
                </label>
                <input
                  disabled={loading}
                  type='email'
                  placeholder='user@eng.jfn.ac.lk'
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`${inputClass} ${loading && "opacity-50"}`}
                />
              </div>

              <div>
                <label className='text-sm text-gray-500 block mb-1'>Role</label>
                <select
                  disabled={loading}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={`${inputClass} ${loading && "opacity-50"}`}
                >
                  <option value=''>Select Role</option>
                  <option value='ADMIN'>Admin</option>
                  <option value='USER'>User</option>
                </select>
              </div>

              <div className='flex gap-3 pt-2'>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2'
                >
                  {loading && <Loader2 size={16} className='animate-spin' />}
                  {editIndex !== null ? "Update" : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className='flex-1 border border-gray-300 dark:border-slate-600 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition disabled:opacity-50'
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

export default UserSettings;
