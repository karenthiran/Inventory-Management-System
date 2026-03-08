import axios from "axios";
import {
  Calendar,
  Loader2,
  LocateFixed,
  Mail,
  Shield,
  UserCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    /** * 1. Check your PostgreSQL database.
     * 2. If the 'username' column has "admin", change "User" below to "admin".
     * 3. Ideally, your Login.jsx should do: localStorage.setItem("username", data.username);
     */
    const storedUsername = localStorage.getItem("username");

    if (!storedUsername) {
      setError("No user logged in.");
      setLoading(false);
      return;
    }

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/users/profile/${storedUsername}`,
        );
        setUser(response.data);
      } catch (err) {
        setError(
          "User profile not found. Please verify the username in the database.",
        );
        console.error(
          "404 Error - Checked path:",
          `${API_BASE_URL}/api/users/profile/${storedUsername}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading)
    return (
      <div className='h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900'>
        <Loader2 className='animate-spin text-indigo-600' size={48} />
      </div>
    );

  if (error)
    return (
      <div className='h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900'>
        <div className='text-red-500 bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm font-medium text-center'>
          {error} <br />
          <span className='text-xs text-gray-400'>
            Target URL: {API_BASE_URL}/api/users/profile/...
          </span>
        </div>
      </div>
    );

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className='h-full flex flex-col px-6 py-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300'>
      <div className='w-[900px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex p-10 gap-10 overflow-hidden relative mx-auto mt-10'>
        <div className='absolute top-0 left-0 w-full h-2 bg-indigo-600'></div>

        {/* Identity Section */}
        <div className='flex flex-col items-center justify-center w-[300px] border-r border-gray-200 dark:border-gray-700 pr-10'>
          <div className='bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-full shadow-sm'>
            <div className='w-36 h-36 rounded-full bg-indigo-600 flex items-center justify-center text-6xl font-bold text-white shadow-inner'>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
          <h2 className='mt-6 text-2xl font-bold text-gray-800 dark:text-gray-100'>
            {user?.username}
          </h2>
          <div className='mt-2 flex items-center gap-2 px-4 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full'>
            <Shield size={14} /> {user?.role}
          </div>

          <div className='mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 w-full text-center'>
            <p className='text-xs text-gray-400 uppercase tracking-tighter mb-1'>
              Member Since
            </p>
            <div className='flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-medium'>
              <Calendar size={16} className='text-indigo-500' /> {joinedDate}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className='flex-1 flex flex-col justify-center space-y-5'>
          <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2'>
            <UserCircle size={20} className='text-indigo-600' /> General
            Information
          </h3>

          <div className='grid grid-cols-1 gap-4'>
            <div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl'>
              <Mail className='text-indigo-400' size={24} />
              <div>
                <p className='text-[10px] text-gray-500 font-bold uppercase'>
                  Email Address
                </p>
                <p className='text-gray-800 dark:text-gray-200 font-semibold'>
                  {user?.email}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl'>
              <LocateFixed className='text-indigo-400' size={24} />
              <div>
                <p className='text-[10px] text-gray-500 font-bold uppercase'>
                  Location
                </p>
                <p className='text-gray-800 dark:text-gray-200 font-semibold'>
                  {user?.location?.locationName || "No Location Assigned"}
                </p>
              </div>
            </div>
          </div>

          <p className='text-center text-[11px] text-gray-400 italic pt-6'>
            Managed by University of Jaffna Faculty of Engineering IMS
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
