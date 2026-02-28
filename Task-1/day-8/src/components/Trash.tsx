import React from 'react';
import { Trash2, RotateCcw, XCircle, AlertCircle } from 'lucide-react';
import { Item } from '../types';

interface TrashProps {
  items: Item[];
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
}

export const Trash: React.FC<TrashProps> = ({ items, onRestore, onPermanentDelete }) => {
  const deletedItems = items.filter(item => item.deleted);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trash2 className="w-6 h-6 text-red-500" />
          Trash
        </h2>
        <span className="text-sm text-slate-500">
          Items here will be permanently deleted after 30 days
        </span>
      </div>

      {deletedItems.length === 0 ? (
        <div className="card p-12 flex flex-col items-center justify-center text-slate-500 space-y-2">
          <Trash2 className="w-12 h-12 opacity-20" />
          <p>Your trash is empty</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {deletedItems.map(item => (
            <div key={item.id} className="card p-4 flex items-center justify-between group">
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-slate-400">
                  Deleted on {new Date(item.deletedAt || 0).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onRestore(item.id)}
                  className="btn btn-secondary text-blue-600 hover:bg-blue-50 border-blue-100 dark:border-blue-900/30"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore
                </button>
                <button
                  onClick={() => onPermanentDelete(item.id)}
                  className="btn btn-secondary text-red-600 hover:bg-red-50 border-red-100 dark:border-red-900/30"
                >
                  <XCircle className="w-4 h-4" />
                  Delete Forever
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg p-4 flex gap-3 text-amber-800 dark:text-amber-200 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p>Warning: Deleting items from trash is permanent and cannot be undone.</p>
      </div>
    </div>
  );
};
