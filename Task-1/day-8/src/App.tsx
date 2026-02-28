import React from 'react';
import { HelpFeedback } from './components/HelpFeedback';
import { MessagePage } from './components/MessagePage';
import { Settings } from './components/Settings';
import { Trash } from './components/Trash';
import type { Item, View } from './types';

const initialItems: Item[] = [
  {
    id: '1',
    name: 'Project Brief.pdf',
    deleted: false
  },
  {
    id: '2',
    name: 'Old Notes.txt',
    deleted: true,
    deletedAt: Date.now() - 1000 * 60 * 60 * 24 * 2
  },
  {
    id: '3',
    name: 'Invoice_2024.xlsx',
    deleted: true,
    deletedAt: Date.now() - 1000 * 60 * 60 * 24 * 12
  }
];

export default function App() {
  const [view, setView] = React.useState<View>('message');
  const [items, setItems] = React.useState<Item[]>(initialItems);
  const [submittedMessage, setSubmittedMessage] = React.useState<string | null>(null);

  const restore = (id: string) => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, deleted: false, deletedAt: undefined } : i))
    );
  };

  const permanentDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const moveToTrash = () => {
    if (!submittedMessage) return;
    const newItem: Item = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      name: submittedMessage,
      deleted: true,
      deletedAt: Date.now()
    };
    setItems(prev => [newItem, ...prev]);
    setSubmittedMessage(null);
    setView('trash');
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-bold text-lg">Platform</h1>
          <nav className="flex gap-2">
            <button
              className={`btn ${view === 'message' ? 'btn-primary' : 'btn-secondary'} text-sm`}
              onClick={() => setView('message')}
            >
              Message
            </button>

            <button
              className={`btn ${view === 'trash' ? 'btn-primary' : 'btn-secondary'} text-sm`}
              onClick={() => setView('trash')}
            >
              Trash
            </button>
            <button
              className={`btn ${view === 'settings' ? 'btn-primary' : 'btn-secondary'} text-sm`}
              onClick={() => setView('settings')}
            >
              Settings
            </button>

            <button
              className={`btn ${view === 'help' ? 'btn-primary' : 'btn-secondary'} text-sm`}
              onClick={() => setView('help')}
            >
              Help
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {view === 'help' && <HelpFeedback />}
        {view === 'trash' && (
          <Trash items={items} onRestore={restore} onPermanentDelete={permanentDelete} />
        )}
        {view === 'settings' && <Settings />}
        {view === 'message' && (
          <MessagePage
            submittedMessage={submittedMessage}
            onSubmit={msg => setSubmittedMessage(msg)}
            onMoveToTrash={moveToTrash}
          />
        )}
      </main>
    </div>
  );
}