import React from 'react';
import { MessageSquareText, Send, Trash2 } from 'lucide-react';

interface MessagePageProps {
  submittedMessage: string | null;
  onSubmit: (message: string) => void;
  onMoveToTrash: () => void;
}

export function MessagePage({ submittedMessage, onSubmit, onMoveToTrash }: MessagePageProps) {
  const [draft, setDraft] = React.useState('');
  const [justSubmitted, setJustSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setDraft('');
    setJustSubmitted(true);
    window.setTimeout(() => setJustSubmitted(false), 600);
  };

  return (
    <div className="max-w-4xl anim-fade-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquareText className="w-7 h-7 text-blue-600" />
            Message
          </h2>
          <p className="mt-2 text-slate-500">
            Write something and keep it safe — or move it to Trash when you’re done.
          </p>
        </div>

        <div className="hidden md:block text-right text-sm text-slate-500">
          <div className="font-medium text-slate-700 dark:text-slate-300">Tips</div>
          <div>Shift + Enter for a new line</div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="card p-6 space-y-3">
          <label className="text-sm font-medium">Enter your message</label>
          <div className="relative">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none h-40 resize-none"
              placeholder="Type your message here..."
            />

            <div className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-between text-xs text-slate-400">
              <span>Characters: {draft.length}</span>
              <span>Auto-trim on submit</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!draft.trim()}
            className={`btn btn-primary w-full ${justSubmitted ? 'anim-pop' : ''} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <Send className="w-4 h-4" />
            Submit
          </button>
        </form>

        <div className={`card p-6 space-y-4 ${submittedMessage ? 'anim-fade-up' : ''}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Submitted message
            </p>
            {submittedMessage ? (
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-200 dark:border-emerald-900/40">
                Ready
              </span>
            ) : (
              <span className="text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-100 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800">
                Empty
              </span>
            )}
          </div>

          {submittedMessage ? (
            <>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 p-4">
                <p className="whitespace-pre-wrap leading-relaxed">{submittedMessage}</p>
              </div>

              <button type="button" className="btn btn-secondary w-full" onClick={onMoveToTrash}>
                <Trash2 className="w-4 h-4" />
                Move to trash
              </button>
            </>
          ) : (
            <p className="text-slate-500">
              Submit a message and it will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
