import React, { useState } from "react";
import { BookOpen, MapPin, UserCircle, Pencil, Trash2, Plus, MapPinnedIcon, BookA, BookmarkCheck, Book, BlocksIcon, LucideBookSearch, LucideBookMarked, LucideBookOpen } from "lucide-react";
import { ArchiveBoxXMarkIcon, BookmarkSquareIcon } from "@heroicons/react/20/solid";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("category");

  // ---------------- CATEGORY ----------------
  const [categories, setCategories] = useState([
    { id: "C-ID-001", name: "Electronic" },
  ]);
  const [categoryForm, setCategoryForm] = useState({ id: "", name: "" });
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editCategoryIndex, setEditCategoryIndex] = useState(null);

  // ---------------- LOCATION ----------------
  const [locations, setLocations] = useState([
    { id: "L-ID-001", name: "Com" },
  ]);
  const [locationForm, setLocationForm] = useState({ id: "", name: "" });
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [editLocationIndex, setEditLocationIndex] = useState(null);

  // ---------------- USER ----------------
  const [users, setUsers] = useState([
    { username: "Admin", email: "admin@eng.jfn.ac.lk", role: "Admin" },
  ]);

  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    role: "User",
    password: "",
    confirmPassword: "",
  });

  const [showUserForm, setShowUserForm] = useState(false);
  const [editUserIndex, setEditUserIndex] = useState(null);
  const [emailError, setEmailError] = useState("");

  // ---------------- COMMON FUNCTIONS ----------------
  const handleAddOrUpdate = (
    list,
    setList,
    form,
    setForm,
    editIndex,
    setEditIndex,
    setShowForm
  ) => {
    if (!form.id || !form.name) return;

    if (editIndex !== null) {
      const updated = [...list];
      updated[editIndex] = form;
      setList(updated);
      setEditIndex(null);
    } else {
      setList([...list, form]);
    }

    setForm({ id: "", name: "" });
    setShowForm(false);
  };

  const handleDelete = (list, setList, index) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* TOP BUTTONS */}
      <div className="flex gap-6 mb-8">
        <button onClick={() => setActiveTab("category")} className="px-6 py-3 border rounded-lg">
          <LucideBookOpen className="inline mr-2" size={18} /> Category
        </button>

        <button onClick={() => setActiveTab("location")} className="px-6 py-3 border rounded-lg">
          <MapPinnedIcon className="inline mr-2" size={18} /> Location
        </button>

        <button onClick={() => setActiveTab("user")} className="px-6 py-3 border rounded-lg">
          <UserCircle className="inline mr-2" size={18} /> User Management
        </button>
      </div>

      {/* CATEGORY */}
      {activeTab === "category" && (
        <div className="flex gap-6">
          <div className="w-2/3 bg-white p-6 rounded shadow">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Category List</h2>
              {!showCategoryForm && (
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded"
                >
                  <Plus size={16} /> Add Category
                </button>
              )}
            </div>

            <table className="w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 border">ID</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((item, index) => (
                  <tr key={index}>
                    <td className="p-3 border">{item.id}</td>
                    <td className="p-3 border">{item.name}</td>
                    <td className="p-3 border flex gap-3">
                      <div
                        className="flex items-center gap-1 text-blue-500 cursor-pointer"
                        onClick={() => {
                          setCategoryForm(item);
                          setEditCategoryIndex(index);
                          setShowCategoryForm(true);
                        }}
                      >
                        <Pencil size={16} /> Edit
                      </div>
                      <div
                        className="flex items-center gap-1 text-red-500 cursor-pointer"
                        onClick={() => handleDelete(categories, setCategories, index)}
                      >
                        <Trash2 size={16} /> Delete
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showCategoryForm && (
            <div className="w-1/3 bg-white p-6 rounded shadow">
              <input
                placeholder="Category ID"
                value={categoryForm.id}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, id: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                placeholder="Category Name"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, name: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded"
              />
              <button
                onClick={() =>
                  handleAddOrUpdate(
                    categories,
                    setCategories,
                    categoryForm,
                    setCategoryForm,
                    editCategoryIndex,
                    setEditCategoryIndex,
                    setShowCategoryForm
                  )
                }
                className="bg-indigo-500 text-white px-4 py-2 rounded"
              >
                {editCategoryIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          )}
        </div>
      )}
      {/* LOCATION */}
{activeTab === "location" && (
  <div className="flex gap-6">
    
    {/* LEFT TABLE */}
    <div className="w-2/3 bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">Location List</h2>

        {!showLocationForm && (
          <button
            onClick={() => setShowLocationForm(true)}
            className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded"
          >
            <Plus size={16} /> Add Location
          </button>
        )}
      </div>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((item, index) => (
            <tr key={index}>
              <td className="p-3 border">{item.id}</td>
              <td className="p-3 border">{item.name}</td>
              <td className="p-3 border flex gap-3">
                <div
                  className="flex items-center gap-1 text-blue-500 cursor-pointer"
                  onClick={() => {
                    setLocationForm(item);
                    setEditLocationIndex(index);
                    setShowLocationForm(true);
                  }}
                >
                  <Pencil size={16} /> Edit
                </div>

                <div
                  className="flex items-center gap-1 text-red-500 cursor-pointer"
                  onClick={() =>
                    setLocations(locations.filter((_, i) => i !== index))
                  }
                >
                  <Trash2 size={16} /> Delete
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* RIGHT FORM */}
    {showLocationForm && (
      <div className="w-1/3 bg-white p-6 rounded shadow">
        <input
          placeholder="Location ID"
          value={locationForm.id}
          onChange={(e) =>
            setLocationForm({ ...locationForm, id: e.target.value })
          }
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          placeholder="Location Name"
          value={locationForm.name}
          onChange={(e) =>
            setLocationForm({ ...locationForm, name: e.target.value })
          }
          className="w-full mb-3 p-2 border rounded"
        />

        <button
          onClick={() => {
            if (editLocationIndex !== null) {
              const updated = [...locations];
              updated[editLocationIndex] = locationForm;
              setLocations(updated);
              setEditLocationIndex(null);
            } else {
              setLocations([...locations, locationForm]);
            }

            setLocationForm({ id: "", name: "" });
            setShowLocationForm(false);
          }}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          {editLocationIndex !== null ? "Update" : "Add"}
        </button>
      </div>
    )}
  </div>
)}

      {/* USER SECTION */}
      {activeTab === "user" && (
        <div className="flex gap-6">

          {/* TABLE */}
          <div className="w-2/3 bg-white p-6 rounded shadow">
            <div className="flex justify-between mb-4">
              <h2>User List</h2>
              {!showUserForm && (
                <button
                  onClick={() => setShowUserForm(true)}
                  className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded"
                >
                  <Plus size={16} /> Add User
                </button>
              )}
            </div>

            <table className="w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 border">Username</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Role</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td className="p-3 border">{user.username}</td>
                    <td className="p-3 border">{user.email}</td>
                    <td className="p-3 border">{user.role}</td>
                    <td className="p-3 border flex gap-3">
                      <div
                        className="flex items-center gap-1 text-blue-500 cursor-pointer"
                        onClick={() => {
                          setUserForm({ ...user, password: "", confirmPassword: "" });
                          setEditUserIndex(index);
                          setShowUserForm(true);
                        }}
                      >
                        <Pencil size={16} /> Edit
                      </div>
                      <div
                        className="flex items-center gap-1 text-red-500 cursor-pointer"
                        onClick={() => handleDelete(users, setUsers, index)}
                      >
                        <Trash2 size={16} /> Delete
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FORM */}
          {showUserForm && (
            <div className="w-1/3 bg-white p-6 rounded shadow">
              <input
                placeholder="Username"
                value={userForm.username}
                onChange={(e) =>
                  setUserForm({ ...userForm, username: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded"
              />

              <input
                placeholder="Email"
                value={userForm.email}
                onChange={(e) => {
                  setUserForm({ ...userForm, email: e.target.value });
                  if (!e.target.value.endsWith("@eng.jfn.ac.lk")) {
                    setEmailError("Only @eng.jfn.ac.lk emails allowed");
                  } else {
                    setEmailError("");
                  }
                }}
                className="w-full mb-1 p-2 border rounded"
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

              <select
                value={userForm.role}
                onChange={(e) =>
                  setUserForm({ ...userForm, role: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>

              <input
                type="password"
                placeholder="Password"
                value={userForm.password}
                onChange={(e) =>
                  setUserForm({ ...userForm, password: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={userForm.confirmPassword}
                onChange={(e) =>
                  setUserForm({ ...userForm, confirmPassword: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded"
              />

              <button
                onClick={() => {
                  if (emailError) return;
                  if (userForm.password !== userForm.confirmPassword) {
                    alert("Passwords do not match");
                    return;
                  }

                  if (editUserIndex !== null) {
                    const updated = [...users];
                    updated[editUserIndex] = userForm;
                    setUsers(updated);
                    setEditUserIndex(null);
                  } else {
                    setUsers([...users, userForm]);
                  }

                  setUserForm({
                    username: "",
                    email: "",
                    role: "User",
                    password: "",
                    confirmPassword: "",
                  });

                  setShowUserForm(false);
                }}
                className="bg-indigo-500 text-white px-4 py-2 rounded w-full"
              >
                {editUserIndex !== null ? "Update User" : "Add User"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;