import React, { useState } from "react";
import {
  UserCircle,
  Pencil,
  Trash2,
  Plus,
  MapPinnedIcon,
  LucideBookOpen,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("category");

  // ---------------- STATE ----------------
  const [categories, setCategories] = useState([
    { id: "C-ID-001", name: "Electronic" },
  ]);
  const [categoryForm, setCategoryForm] = useState({ id: "", name: "" });
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editCategoryIndex, setEditCategoryIndex] = useState(null);

  const [locations, setLocations] = useState([{ id: "L-ID-001", name: "Com" }]);
  const [locationForm, setLocationForm] = useState({ id: "", name: "" });
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [editLocationIndex, setEditLocationIndex] = useState(null);

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

  // ---------------- LOGIC ----------------
  const handleAddOrUpdate = (
    list,
    setList,
    form,
    setForm,
    editIndex,
    setEditIndex,
    setShowForm,
    emptyForm,
  ) => {
    if (!form.id && !form.username) return;
    if (editIndex !== null) {
      const updated = [...list];
      updated[editIndex] = form;
      setList(updated);
      setEditIndex(null);
    } else {
      setList([...list, form]);
    }
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (list, setList, index) => {
    setList(list.filter((_, i) => i !== index));
  };

  // ---------------- UI HELPERS ----------------
  const tabBtnClass = (tab) =>
    `flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all font-medium ${
      activeTab === tab
        ? "bg-indigo-600 text-white shadow-md"
        : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700"
    }`;

  const inputClass =
    "w-full px-4 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition";

  const cardClass =
    "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-slate-900 dark:text-white transition-colors duration-300 px-8 py-10 lg:px-24">
      {/* TOP NAVIGATION */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setActiveTab("category")}
          className={tabBtnClass("category")}
        >
          <LucideBookOpen size={18} /> Category
        </button>
        <button
          onClick={() => setActiveTab("location")}
          className={tabBtnClass("location")}
        >
          <MapPinnedIcon size={18} /> Location
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={tabBtnClass("user")}
        >
          <UserCircle size={18} /> Users
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: TABLE SECTION */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800">
            <h2 className="font-bold text-lg text-slate-700 dark:text-white capitalize">
              {activeTab} List
            </h2>

            {!(
              (activeTab === "category" && showCategoryForm) ||
              (activeTab === "location" && showLocationForm) ||
              (activeTab === "user" && showUserForm)
            ) && (
              <button
                onClick={() => {
                  if (activeTab === "category") setShowCategoryForm(true);
                  else if (activeTab === "location") setShowLocationForm(true);
                  else setShowUserForm(true);
                }}
                className="flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700"
              >
                <Plus size={14} /> Add New
              </button>
            )}
          </div>

          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-slate-800 text-slate-500 dark:text-gray-300 text-sm uppercase">
              <tr>
                {activeTab === "user" ? (
                  <>
                    <th className="p-4 font-semibold text-center">Username</th>
                    <th className="p-4 font-semibold text-center">Email</th>
                    <th className="p-4 font-semibold text-center">Role</th>
                  </>
                ) : (
                  <>
                    <th className="p-4 font-semibold text-center">ID</th>
                    <th className="p-4 font-semibold text-center">Name</th>
                  </>
                )}
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {(activeTab === "category"
                ? categories
                : activeTab === "location"
                  ? locations
                  : users
              ).map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {activeTab === "user" ? (
                    <>
                      <td className="p-4 text-sm text-center">
                        {item.username}
                      </td>
                      <td className="p-4 text-sm text-slate-500 dark:text-gray-400 text-center">
                        {item.email}
                      </td>
                      <td className="p-4 text-sm text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.role === "Admin"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 text-sm font-medium text-center">
                        {item.id}
                      </td>
                      <td className="p-4 text-sm text-slate-600 dark:text-gray-300 text-center">
                        {item.name}
                      </td>
                    </>
                  )}

                  <td className="p-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          if (activeTab === "category") {
                            setCategoryForm(item);
                            setEditCategoryIndex(index);
                            setShowCategoryForm(true);
                          } else if (activeTab === "location") {
                            setLocationForm(item);
                            setEditLocationIndex(index);
                            setShowLocationForm(true);
                          } else {
                            setUserForm({
                              ...item,
                              password: "",
                              confirmPassword: "",
                            });
                            setEditUserIndex(index);
                            setShowUserForm(true);
                          }
                        }}
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 text-sm font-medium"
                      >
                        <Pencil size={14} /> Edit
                      </button>

                      <button
                        onClick={() => {
                          if (activeTab === "category")
                            handleDelete(categories, setCategories, index);
                          else if (activeTab === "location")
                            handleDelete(locations, setLocations, index);
                          else handleDelete(users, setUsers, index);
                        }}
                        className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 flex items-center gap-1 text-sm font-medium"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT: FORM SECTION */}
        <div className="w-full lg:w-1/3">
          {((activeTab === "category" && showCategoryForm) ||
            (activeTab === "location" && showLocationForm) ||
            (activeTab === "user" && showUserForm)) && (
            <div className={cardClass}>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                {editCategoryIndex !== null ||
                editLocationIndex !== null ||
                editUserIndex !== null
                  ? "Update"
                  : "Add New"}{" "}
                {activeTab}
              </h3>

              <div className="space-y-4">
                {activeTab === "user" ? (
                  <>
                    <input
                      placeholder="Username"
                      value={userForm.username}
                      onChange={(e) =>
                        setUserForm({ ...userForm, username: e.target.value })
                      }
                      className={inputClass}
                    />
                    <div>
                      <input
                        placeholder="Email (@eng.jfn.ac.lk)"
                        value={userForm.email}
                        onChange={(e) => {
                          setUserForm({ ...userForm, email: e.target.value });
                          setEmailError(
                            !e.target.value.endsWith("@eng.jfn.ac.lk")
                              ? "Only @eng.jfn.ac.lk emails allowed"
                              : "",
                          );
                        }}
                        className={inputClass}
                      />
                      {emailError && (
                        <p className="text-rose-500 text-xs mt-1">
                          {emailError}
                        </p>
                      )}
                    </div>
                    <select
                      value={userForm.role}
                      onChange={(e) =>
                        setUserForm({ ...userForm, role: e.target.value })
                      }
                      className={inputClass}
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
                      className={inputClass}
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={userForm.confirmPassword}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </>
                ) : (
                  <>
                    <input
                      placeholder={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ID`}
                      value={
                        activeTab === "category"
                          ? categoryForm.id
                          : locationForm.id
                      }
                      onChange={(e) =>
                        activeTab === "category"
                          ? setCategoryForm({
                              ...categoryForm,
                              id: e.target.value,
                            })
                          : setLocationForm({
                              ...locationForm,
                              id: e.target.value,
                            })
                      }
                      className={inputClass}
                    />
                    <input
                      placeholder="Name"
                      value={
                        activeTab === "category"
                          ? categoryForm.name
                          : locationForm.name
                      }
                      onChange={(e) =>
                        activeTab === "category"
                          ? setCategoryForm({
                              ...categoryForm,
                              name: e.target.value,
                            })
                          : setLocationForm({
                              ...locationForm,
                              name: e.target.value,
                            })
                      }
                      className={inputClass}
                    />
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (activeTab === "user") {
                        if (
                          emailError ||
                          userForm.password !== userForm.confirmPassword
                        ) {
                          if (userForm.password !== userForm.confirmPassword)
                            alert("Passwords do not match");
                          return;
                        }
                        handleAddOrUpdate(
                          users,
                          setUsers,
                          userForm,
                          setUserForm,
                          editUserIndex,
                          setEditUserIndex,
                          setShowUserForm,
                          {
                            username: "",
                            email: "",
                            role: "User",
                            password: "",
                            confirmPassword: "",
                          },
                        );
                      } else if (activeTab === "category") {
                        handleAddOrUpdate(
                          categories,
                          setCategories,
                          categoryForm,
                          setCategoryForm,
                          editCategoryIndex,
                          setEditCategoryIndex,
                          setShowCategoryForm,
                          { id: "", name: "" },
                        );
                      } else {
                        handleAddOrUpdate(
                          locations,
                          setLocations,
                          locationForm,
                          setLocationForm,
                          editLocationIndex,
                          setEditLocationIndex,
                          setShowLocationForm,
                          { id: "", name: "" },
                        );
                      }
                    }}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-md font-semibold 
hover:bg-indigo-700 transition shadow-sm dark:shadow-md"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      if (activeTab === "category") {
                        setShowCategoryForm(false);
                        setEditCategoryIndex(null);
                        setCategoryForm({ id: "", name: "" });
                      } else if (activeTab === "location") {
                        setShowLocationForm(false);
                        setEditLocationIndex(null);
                        setLocationForm({ id: "", name: "" });
                      } else {
                        setShowUserForm(false);
                        setEditUserIndex(null);
                        setUserForm({
                          username: "",
                          email: "",
                          role: "User",
                          password: "",
                          confirmPassword: "",
                        });
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-slate-600 
bg-white dark:bg-slate-800 
text-slate-700 dark:text-gray-200 
hover:bg-gray-50 dark:hover:bg-slate-700 
rounded-md transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
