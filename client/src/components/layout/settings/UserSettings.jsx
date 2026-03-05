import React, { useState } from "react";
import { Trash2, Plus, Pencil } from "lucide-react";

const UserSettings = () => {
  const [users, setUsers] = useState([
    { username: "Admin", email: "admin@eng.jfn.ac.lk", role: "Admin" },
  ]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    role: "",
  });

  const inputClass =
    "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  // ---------------- EMAIL VALIDATION ----------------
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@eng\.jfn\.ac\.lk$/;
    return regex.test(email);
  };

  // ---------------- SAVE USER ----------------
  const handleSave = () => {
    let newErrors = {
      username: "",
      email: "",
      role: "",
    };

    const trimmedUsername = form.username.trim();
    const trimmedEmail = form.email.trim();

    if (!trimmedUsername) {
      newErrors.username = "Username is required";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(trimmedEmail)) {
      newErrors.email = "Only @eng.jfn.ac.lk email addresses are allowed";
    }

    if (!form.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);

    if (newErrors.username || newErrors.email || newErrors.role) return;

    const newUser = {
      username: trimmedUsername,
      email: trimmedEmail,
      role: form.role,
    };

    if (editIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editIndex] = newUser;
      setUsers(updatedUsers);
      setEditIndex(null);
    } else {
      setUsers([...users, newUser]);
    }

    setForm({ username: "", email: "", role: "" });
    setErrors({ username: "", email: "", role: "" });
    setShowForm(false);
  };

  // ---------------- DELETE USER ----------------
  const handleDelete = (index) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  // ---------------- CANCEL ----------------
  const handleCancel = () => {
    setShowForm(false);
    setEditIndex(null);
    setForm({ username: "", email: "", role: "" });
    setErrors({ username: "", email: "", role: "" });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>

        <button
          onClick={() => {
            setShowForm(true);
            setEditIndex(null);
            setForm({ username: "", email: "", role: "" });
            setErrors({ username: "", email: "", role: "" });
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex gap-6">
        {/* TABLE */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800 text-center">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold">Username</th>
                <th className="px-6 py-3 text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-sm font-semibold">Role</th>
                <th className="px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400">
                    No users added
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <td className="px-6 py-3 text-center">{user.username}</td>

                    <td className="px-6 py-3 text-center">{user.email}</td>

                    <td className="px-6 py-3 text-center">
                      <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center gap-3">
                        {/* EDIT */}
                        <button
                          onClick={() => {
                            setForm({ ...user });
                            setEditIndex(index);
                            setShowForm(true);
                            setErrors({
                              username: "",
                              email: "",
                              role: "",
                            });
                          }}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <Pencil size={18} />
                        </button>

                        {/* DELETE */}
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
              {editIndex !== null ? "Update User" : "Add User"}
            </h3>

            <div className="space-y-4">
              {/* USERNAME */}
              <div>
                <label className="text-sm text-gray-500">Username</label>
                <input
                  placeholder="Enter username"
                  value={form.username}
                  onChange={(e) => {
                    setForm({ ...form, username: e.target.value });
                    setErrors({ ...errors, username: "" });
                  }}
                  className={inputClass}
                />

                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <input
                  type="email"
                  placeholder="user@eng.jfn.ac.lk"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                  }}
                  className={inputClass}
                />

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* ROLE */}
              <div>
                <label className="text-sm text-gray-500">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => {
                    setForm({ ...form, role: e.target.value });
                    setErrors({ ...errors, role: "" });
                  }}
                  className={inputClass}
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                  <option value="Super Admin">Super Admin</option>
                </select>

                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
                >
                  {editIndex !== null ? "Update" : "Save"}
                </button>

                <button
                  onClick={handleCancel}
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

export default UserSettings;
