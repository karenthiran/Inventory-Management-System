import axios from "axios";
import { ChevronDown, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Email = ({ isOpen = false, onClose = () => {} }) => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const fromEmail = loggedInUser?.email || "";
  const fromUsername = loggedInUser?.username || "";

  const [formData, setFormData] = useState({
    to_email: "",
    to_username: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    axios
      .get(`${API_BASE_URL}/api/users/all`)
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Could not load users."));
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileName("");
    if (form.current?.attachment) form.current.attachment.value = "";
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.to_email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      data.append("to_email", formData.to_email);
      data.append("subject", formData.subject);
      data.append("message", formData.message);
      data.append("from_email", fromEmail);
      data.append("from_username", fromUsername);
      if (file) data.append("attachment", file);

      await axios.post(`${API_BASE_URL}/api/email/send`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Email sent successfully!");
      setFormData({ to_email: "", to_username: "", subject: "", message: "" });
      setUserSearch("");
      removeFile();
      onClose();
    } catch (error) {
      const msg = error.response?.data || "Failed to send email.";
      toast.error(typeof msg === "string" ? msg : "Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center'>
      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-200 dark:border-gray-700'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Send Email
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          >
            <X size={20} />
          </button>
        </div>

        <form ref={form} onSubmit={handleSubmit} className='p-5 space-y-4'>
          {/* From */}
          <div>
            <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200'>
              From
            </label>
            <input
              type='text'
              readOnly
              value={`${fromUsername} (${fromEmail})`}
              className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-400 text-gray-500 cursor-not-allowed outline-none'
            />
          </div>

          {/* Recipient Dropdown */}
          <div className='relative'>
            <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200'>
              Send Email To
            </label>
            <div
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white outline-none cursor-pointer flex items-center justify-between'
            >
              <span
                className={
                  formData.to_email
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-400"
                }
              >
                {formData.to_username
                  ? `${formData.to_username} (${formData.to_email})`
                  : "Select recipient..."}
              </span>
              <ChevronDown size={16} className='text-gray-400 shrink-0' />
            </div>
            {showUserDropdown && (
              <div className='absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-[9999] overflow-hidden'>
                <div className='px-3 py-2 border-b border-gray-200 dark:border-gray-600'>
                  <input
                    type='text'
                    placeholder='Search user...'
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className='w-full text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 dark:text-white outline-none'
                  />
                </div>
                <div className='max-h-44 overflow-y-auto'>
                  {filteredUsers.length === 0 ? (
                    <div className='px-4 py-3 text-sm text-gray-400 italic'>
                      No users found
                    </div>
                  ) : (
                    filteredUsers.map((u) => (
                      <div
                        key={u.email}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            to_email: u.email,
                            to_username: u.username,
                          });
                          setShowUserDropdown(false);
                          setUserSearch("");
                        }}
                        className='px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer border-b last:border-0 border-gray-100 dark:border-gray-600'
                      >
                        <div className='text-sm font-semibold dark:text-white'>
                          {u.username}
                        </div>
                        <div className='text-[11px] opacity-70 dark:text-gray-300'>
                          {u.email}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200'>
              Subject
            </label>
            <input
              type='text'
              name='subject'
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder='Email subject'
              className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white outline-none'
            />
          </div>

          {/* Message */}
          <div>
            <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200'>
              Message
            </label>
            <textarea
              name='message'
              rows='4'
              required
              value={formData.message}
              onChange={handleChange}
              placeholder='Write your message...'
              className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white outline-none'
            />
          </div>

          {/* Attachment */}
          <div>
            <label className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200'>
              Attachment{" "}
              <span className='text-gray-400 font-normal'>(optional)</span>
            </label>
            <label className='flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700'>
              <Upload size={18} className='text-gray-500 dark:text-gray-300' />
              <span className='text-xs mt-1 text-gray-600 dark:text-gray-300'>
                Upload file
              </span>
              <input
                type='file'
                name='attachment'
                className='hidden'
                onChange={handleFileChange}
              />
            </label>
            {fileName && (
              <div className='flex justify-between items-center mt-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-xs'>
                <span className='truncate text-gray-700 dark:text-gray-200'>
                  {fileName}
                </span>
                <button
                  type='button'
                  onClick={removeFile}
                  className='text-red-500'
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <button
            type='submit'
            disabled={loading || !formData.to_email}
            className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg disabled:opacity-50 transition-colors'
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Email;
