import { useState } from 'react'
import ActionSheet from './ActionSheet'

const TYPE_ICONS = {
  link: { icon: 'link', bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600' },
  image: { icon: 'image', bg: 'bg-rose-100 dark:bg-rose-900/30', color: 'text-rose-500' },
  document: { icon: 'description', bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-600' },
  video: { icon: 'movie', bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-500' },
  note: { icon: 'sticky_note_2', bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600' },
}

export default function ItemCard({ item, onUpdate, onDelete }) {
  const [showActions, setShowActions] = useState(false)
  const [anchorPos, setAnchorPos] = useState(null)
  const meta = TYPE_ICONS[item.type] || TYPE_ICONS.note

  const handleContextMenu = (e) => {
    e.preventDefault()
    setAnchorPos({ x: e.clientX, y: e.clientY })
    setShowActions(true)
  }

  return (
    <>
      <tr
        onContextMenu={handleContextMenu}
        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group border-b border-slate-100 dark:border-slate-800"
      >
        <td className="px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
              <span className={`material-symbols-outlined text-[18px] ${meta.color}`}>{meta.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.title}</p>
              {item.description && <p className="text-xs text-slate-400 truncate">{item.description}</p>}
            </div>
          </div>
        </td>
        <td className="px-6 py-3.5 text-xs text-slate-400 capitalize">{item.type}</td>
        <td className="px-6 py-3.5 text-xs text-slate-400">
          {new Date(item.updatedAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-3.5 text-right">
          <button
            onClick={(e) => { e.stopPropagation(); setAnchorPos({ x: e.clientX, y: e.clientY }); setShowActions(true) }}
            className="p-1 opacity-0 group-hover:opacity-100 hover:text-primary transition-all"
            aria-label="Item actions"
          >
            <span className="material-symbols-outlined text-[18px]">more_horiz</span>
          </button>
        </td>
      </tr>

      {showActions && (
        <ActionSheet
          item={item}
          position={anchorPos}
          onClose={() => setShowActions(false)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  )
}
