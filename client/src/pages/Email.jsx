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
    if (file) {
      setFileName(file.name);
    }
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
    <div className="p-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-6 text-indigo-600 dark:text-white">
          Send Email
        </h2>

        <form ref={form} onSubmit={sendEmail} className="space-y-5">
          {/* Recipient Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              name="to_email"
              required
              placeholder="example@email.com"
              className="w-full border border-gray-300 dark:border-gray-700
              bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm
              outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              required
              placeholder="Email subject"
              className="w-full border border-gray-300 dark:border-gray-700
              bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm
              outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              name="message"
              rows="5"
              required
              placeholder="Write your message..."
              className="w-full border border-gray-300 dark:border-gray-700
              bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm
              outline-none focus:ring-2 focus:ring-indigo-400"
            ></textarea>
          </div>

          {/* Attachment UI */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Attachment (optional)
            </label>

            <label
              className="flex flex-col items-center justify-center
              w-full h-28 border-2 border-dashed
              border-gray-300 dark:border-gray-700
              rounded-lg cursor-pointer
              bg-gray-50 dark:bg-gray-800
              hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Upload className="text-gray-500 mb-1" size={20} />

              <span className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload file
              </span>

              <input
                type="file"
                name="attachment"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Selected File */}
            {fileName && (
              <div
                className="flex items-center justify-between mt-2
              bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg text-sm"
              >
                <span className="truncate">{fileName}</span>

                <X
                  size={16}
                  className="cursor-pointer text-red-500"
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
            text-white py-2 rounded-lg transition"
          >
            {loading ? "Sending..." : "Send Email"}
          </button>

          {/* Status */}
          {status && (
            <p className="text-center text-sm text-green-500 mt-2">{status}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Email;
