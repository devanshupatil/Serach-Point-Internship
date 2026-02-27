const ConfirmModal = ({ type, data, onConfirm, onCancel }) => {
  const isFolder = type === 'folder';
  const { folder, itemCount, item } = data || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            {isFolder ? 'Delete Folder' : 'Move to Trash'}
          </h2>
          <p className="text-slate-600">
            {isFolder ? (
              <>
                Are you sure you want to delete folder "<strong>{folder?.name}</strong>"?
                {itemCount > 0 && (
                  <span className="block mt-2 text-red-600">
                    This folder contains {itemCount} item{itemCount > 1 ? 's' : ''}.
                  </span>
                )}
              </>
            ) : (
              <>Move "<strong>{item?.title || item?.content?.substring(0, 30)}</strong>" to trash?</>
            )}
          </p>
          {isFolder && itemCount > 0 && (
            <div className="mt-4 p-3 bg-slate-100 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="moveItems" className="w-4 h-4" />
                <span className="text-sm text-slate-700">Move items to root instead of deleting</span>
              </label>
            </div>
          )}
        </div>
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            {isFolder ? 'Delete Folder' : 'Move to Trash'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
