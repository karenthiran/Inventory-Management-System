import React, { useState } from "react";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [user, setUser] = useState({
    username: "Kavin",
    email: "admin@eng.jfn.ac.lk",
    role: "Admin",
    password: "",
    confirmPassword: "",
  });

  const [tempUser, setTempUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTempUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setTempUser(user);
    setIsEditing(false);
    setShowPassword(false);
  };

  const handleSave = () => {
    if (showPassword && tempUser.password !== tempUser.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setUser(tempUser);
    setIsEditing(false);
    setShowPassword(false);

    console.log("Saved user:", tempUser);
  };

  return (
    <div className="h-full flex flex-col px-6 py-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Profile Card */}
      <div className="w-[850px] bg-white dark:bg-gray-800 rounded-xl shadow-lg flex p-8 gap-10">
        {/* LEFT SIDE */}
        <div className="flex flex-col items-center justify-center w-[250px] border-r border-gray-300 dark:border-gray-700 pr-6">
          <div className="relative">
            {/* Profile Image or Placeholder */}
            {profileImage ? (
              <img
                src={profileImage}
                alt="profile"
                className="w-36 h-36 rounded-full object-cover"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-4xl font-semibold text-white">
                {tempUser.username.charAt(0)}
              </div>
            )}

            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded cursor-pointer">
                Change
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
            {tempUser.username}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {tempUser.role}
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Username */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={tempUser.username}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
              bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white
              focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={tempUser.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
              bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white
              focus:outline-none"
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              User Role
            </label>
            <input
              type="text"
              value={tempUser.role}
              disabled
              className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
              bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white
              cursor-not-allowed"
            />
          </div>

          {/* Change Password */}
          {isEditing && !showPassword && (
            <button
              onClick={() => setShowPassword(true)}
              className="text-blue-600 text-sm text-left mb-4"
            >
              Change Password
            </button>
          )}

          {showPassword && (
            <>
              <div className="mb-4">
                <label className="text-sm text-gray-600 dark:text-gray-300">
                  New Password
                </label>
                <input
                  placeholder="Enter new password"
                  type="password"
                  name="password"
                  value={tempUser.password}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                  bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white"
                />
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600 dark:text-gray-300">
                  Confirm Password
                </label>
                <input
                  placeholder="Confirm new password"
                  type="password"
                  name="confirmPassword"
                  value={tempUser.confirmPassword}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                  bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white"
                />
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Save
                </button>

                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
