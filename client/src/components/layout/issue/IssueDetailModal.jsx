const IssueDetailModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border dark:border-gray-700'>
        {/* Header with Status Indicator */}
        <div className='px-8 py-5 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>
              Issue Details
            </h2>
            <p className='text-sm text-gray-500 mt-1'>
              Transaction ID: #{data.dbId}
            </p>
          </div>
          <div className='flex flex-col items-end gap-2'>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors'
            >
              <span className='text-2xl'>×</span>
            </button>
            {data.isReturned ? (
              <span className='px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full'>
                Returned
              </span>
            ) : (
              <span className='px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200 rounded-full'>
                In Use
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className='p-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12'>
            {/* Column 1: Item Info */}
            <div className='space-y-6'>
              <section>
                <label className='block text-xs font-bold text-indigo-600 uppercase mb-2'>
                  Item Information
                </label>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                  {data.itemName}
                </h3>
                <p className='text-sm text-gray-500 mt-1'>
                  Total Quantity:{" "}
                  <span className='font-semibold text-gray-700 dark:text-gray-300'>
                    {data.quantity} Units
                  </span>
                </p>
              </section>

              <section>
                <label className='block text-xs font-bold text-indigo-600 uppercase mb-2'>
                  Specific Item Codes
                </label>
                <div className='flex flex-wrap gap-2'>
                  {data.itemCodes && data.itemCodes.length > 0 ? (
                    data.itemCodes.map((code, idx) => (
                      <span
                        key={idx}
                        className='bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800 font-mono text-xs'
                      >
                        {code}
                      </span>
                    ))
                  ) : (
                    <span className='text-gray-400 italic text-sm'>
                      No codes assigned
                    </span>
                  )}
                </div>
              </section>

              <section>
                <label className='block text-xs font-bold text-indigo-600 uppercase mb-2'>
                  Location (Where to get)
                </label>
                <p className='text-gray-800 dark:text-gray-200 font-medium'>
                  {data.location}
                </p>
              </section>
            </div>

            {/* Column 2: People & Dates */}
            <div className='space-y-6'>
              <section className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-bold text-indigo-600 uppercase mb-1'>
                    Who Gave (Admin)
                  </label>
                  <p className='text-gray-800 dark:text-gray-200 font-medium'>
                    {data.issuedBy}
                  </p>
                </div>
                <div>
                  <label className='block text-xs font-bold text-indigo-600 uppercase mb-1'>
                    Who Got (User)
                  </label>
                  <p className='text-gray-800 dark:text-gray-200 font-medium'>
                    {data.user}
                  </p>
                  <p className='text-xs text-gray-500 truncate'>
                    {data.userEmail}
                  </p>
                </div>
              </section>

              <section className='grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700'>
                <div>
                  <label className='block text-xs font-bold text-indigo-600 uppercase mb-1'>
                    Issue Date
                  </label>
                  <p className='text-gray-800 dark:text-gray-200'>
                    {data.issueDate}
                  </p>
                </div>
                <div>
                  <label className='block text-xs font-bold text-indigo-600 uppercase mb-1'>
                    Expected Return
                  </label>
                  <p
                    className={`font-semibold ${!data.isReturned && new Date(data.dueDate) < new Date() ? "text-red-600" : "text-gray-800 dark:text-gray-200"}`}
                  >
                    {data.dueDate}
                  </p>
                </div>
              </section>

              <section className='pt-4'>
                <label className='block text-xs font-bold text-indigo-600 uppercase mb-2'>
                  Administrative Notes
                </label>
                <div className='bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700'>
                  <p className='text-sm text-gray-600 dark:text-gray-400 italic'>
                    {data.notes || "No extra notes for this issue."}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='px-8 py-5 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 text-right'>
          <button
            onClick={onClose}
            className='px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none'
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailModal;
