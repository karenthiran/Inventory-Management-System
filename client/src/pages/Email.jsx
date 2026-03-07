import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Upload, X } from "lucide-react";

const Email = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  const removeFile = () => {
    setFileName("");
    form.current.attachment.value = "";
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    emailjs
      .sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        form.current,
        "YOUR_PUBLIC_KEY",
      )
      .then(
        () => {
          setLoading(false);
          setStatus("Email sent successfully!");
          form.current.reset();
          setFileName("");
        },
        (error) => {
          setLoading(false);
          setStatus("Failed to send email.");
          console.error(error);
        },
      );
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 shadow-md rounded-lg p-5 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
          Send Email
        </h2>

        <form ref={form} onSubmit={sendEmail} className="space-y-4">
          {/* Email + Subject */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">
                Send Email To
              </label>
              <input
                type="email"
                name="to_email"
                required
                placeholder="user@eng.jfn.ac.lk"
                className="w-full border border-gray-300 dark:border-gray-600
                bg-gray-100 dark:bg-gray-800
                text-gray-800 dark:text-gray-200
                placeholder-gray-500 dark:placeholder-gray-400
                rounded-md px-3 py-2 text-sm
                outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder="Email subject"
                className="w-full border border-gray-300 dark:border-gray-600
                bg-gray-100 dark:bg-gray-800
                text-gray-800 dark:text-gray-200
                placeholder-gray-500 dark:placeholder-gray-400
                rounded-md px-3 py-2 text-sm
                outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              required
              placeholder="Write your message..."
              className="w-full border border-gray-300 dark:border-gray-600
              bg-gray-100 dark:bg-gray-800
              text-gray-800 dark:text-gray-200
              placeholder-gray-500 dark:placeholder-gray-400
              rounded-md px-3 py-2 text-sm
              outline-none focus:ring-2 focus:ring-indigo-400"
            ></textarea>
          </div>

          {/* Attachment */}
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
              Attachment
            </label>

            <label
              className="flex flex-col items-center justify-center
              w-full h-20 border-2 border-dashed
              border-gray-300 dark:border-gray-600
              rounded-md cursor-pointer
              bg-gray-50 dark:bg-gray-800
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition"
            >
              <Upload size={18} className="text-gray-500 dark:text-gray-400" />

              <span className="text-xs text-gray-600 dark:text-gray-400">
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
              <div
                className="flex items-center justify-between mt-2
                bg-gray-100 dark:bg-gray-800
                text-gray-700 dark:text-gray-300
                px-3 py-1.5 rounded-md text-xs"
              >
                <span className="truncate">{fileName}</span>

                <X
                  size={14}
                  className="cursor-pointer text-red-500 hover:text-red-600"
                  onClick={removeFile}
                />
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700
            text-white py-2 rounded-md text-sm transition"
          >
            {loading ? "Sending..." : "Send Email"}
          </button>

          {status && (
            <p className="text-center text-xs text-green-600 dark:text-green-400">
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Email;
