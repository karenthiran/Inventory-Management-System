import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Upload, X } from "lucide-react";

const Email = ({ isOpen = false, onClose = () => {} }) => {
  const form = useRef();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [fileName, setFileName] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const removeFile = () => {
    setFileName("");
    if (form.current?.attachment) {
      form.current.attachment.value = "";
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    emailjs
      .sendForm(
        "service_ji7iuhp",
        "template_s2d2lrk",
        form.current,
        "T7pugy3XTgikYV4oC"
      )
      .then(
        () => {
          setLoading(false);
          setStatus("Email sent successfully!");
          form.current.reset();
          setFileName("");
        },
        () => {
          setLoading(false);
          setStatus("Failed to send email.");
        }
      );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/10">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Send Email
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <form ref={form} onSubmit={sendEmail} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Send Email To
            </label>
            <input
              type="email"
              name="to_email"
              required
              placeholder="user@eng.jfn.ac.lk"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              required
              placeholder="Email subject"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              required
              placeholder="Write your message..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Attachment
            </label>

            <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700">
              <Upload size={18} className="text-gray-500 dark:text-gray-300" />
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                Upload file
              </span>

              <input
                type="file"
                name="attachment"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {fileName && (
              <div className="flex justify-between items-center mt-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-xs">
                <span className="truncate text-gray-700 dark:text-gray-200">
                  {fileName}
                </span>

                <button
                  type="button"
                  onClick={removeFile}
                  className="text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
          >
            {loading ? "Sending..." : "Send Email"}
          </button>

          {status && (
            <p className="text-center text-sm text-green-600">
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Email;