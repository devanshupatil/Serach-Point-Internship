import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getItems, getFolders, deleteItem } from '../services/storage'
import ItemCard from '../components/ItemCard'

export default function FolderView() {
  const { id } = useParams()
  const [items, setItems] = useState([])
  const [folder, setFolder] = useState(null)

  const load = () => {
    const folders = getFolders()
    setFolder(folders.find(f => f.id === id) || { name: 'Unknown Folder' })
    setItems(getItems().filter(i => i.folderId === id && !i.deleted && !i.archived))
  }

  useEffect(() => { load() }, [id])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/" className="text-slate-400 hover:text-primary text-sm">Home</Link>
        <span className="text-slate-300">›</span>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">{folder?.name}</h2>
        <span className="ml-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold">{items.length} items</span>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">folder_open</span>
            <p className="text-sm font-semibold text-slate-400">This folder is empty</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Modified</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <ItemCard key={item.id} item={item}
                  onUpdate={load}
                  onDelete={(id) => { deleteItem(id); load() }}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
