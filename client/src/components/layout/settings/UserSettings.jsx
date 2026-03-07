import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const UserSettings = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "",
    password: "User@123",
    location: { locationId: "LOC001" },
  });

  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // Kept for UI logic
  const [errors, setErrors] = useState({});

  const inputClass =
    "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all";

  // 1. FETCH ALL USERS
  const fetchUsers = async () => {
    setFetchLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/all`);
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@eng\.jfn\.ac\.lk$/.test(email);
  };

  // 2. SAVE NEW USER
  const handleSave = async () => {
    let newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Only @eng.jfn.ac.lk allowed";
    }
    if (!form.role) newErrors.role = "Please select a role";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/users/register`, form);
      await fetchUsers();
      handleCancel();
    } catch (err) {
      console.error("Save error:", err);
      setErrors({ server: err.response?.data || "Failed to save user." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditIndex(null);
    setForm({
      username: "",
      email: "",
      role: "",
      password: "User@123",
      location: { locationId: "LCT100" },
    });
    setErrors({});
  };

  return (
    <div className='space-y-6 font-[Poppins]'>
      {/* HEADER */}
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>User Management</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditIndex(null);
            handleCancel();
            setShowForm(true);
          }}
          className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition'
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* CONTENT GRID */}
      <div className='flex gap-6'>
        {/* TABLE */}
        <div className='flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden'>
          <table className='w-full'>
            <thead className='bg-gray-50 dark:bg-slate-800 text-center'>
              <tr>
                <th className='px-6 py-3 text-sm font-semibold'>Username</th>
                <th className='px-6 py-3 text-sm font-semibold'>Email</th>
                <th className='px-6 py-3 text-sm font-semibold'>Role</th>
                <th className='px-6 py-3 text-sm font-semibold text-center'>
                  Location
                </th>
              </tr>
            </thead>

            <tbody>
              {fetchLoading ? (
                <tr>
                  <td colSpan='4' className='text-center py-10'>
                    <Loader2
                      className='animate-spin mx-auto text-indigo-500'
                      size={24}
                    />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan='4' className='text-center py-10 text-gray-400'>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={index}
                    className='border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors'
                  >
                    <td className='px-6 py-3 text-center'>{user.username}</td>
                    <td className='px-6 py-3 text-center text-gray-500'>
                      {user.email}
                    </td>
                    <td className='px-6 py-3 text-center'>
                      <span className='px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium'>
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-3 text-center text-gray-400 text-sm'>
                      {user.location?.locationId || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FORM */}
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
                  placeholder='Enter username'
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  className={inputClass}
                />
                {errors.username && (
                  <p className='text-red-500 text-xs mt-1'>{errors.username}</p>
                )}
              </div>

              <div>
                <label className='text-sm text-gray-500 block mb-1'>
                  Email
                </label>
                <input
                  type='email'
                  placeholder='user@eng.jfn.ac.lk'
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
                {errors.email && (
                  <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
                )}
              </div>

              <div>
                <label className='text-sm text-gray-500 block mb-1'>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={inputClass}
                >
                  <option value=''>Select Role</option>
                  <option value='ADMIN'>Admin</option>
                  <option value='USER'>User</option>
                </select>
                {errors.role && (
                  <p className='text-red-500 text-xs mt-1'>{errors.role}</p>
                )}
              </div>

              <div className='flex gap-3 pt-2'>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition disabled:opacity-50 flex justify-center items-center gap-2'
                >
                  {loading && <Loader2 size={16} className='animate-spin' />}
                  {editIndex !== null ? "Update" : "Save"}
                </button>

                <button
                  onClick={handleCancel}
                  className='flex-1 border border-gray-300 dark:border-slate-600 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition'
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
