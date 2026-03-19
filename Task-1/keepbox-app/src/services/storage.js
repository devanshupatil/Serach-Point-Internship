const KEYS = {
  ITEMS: 'keepbox_items',
  FOLDERS: 'keepbox_folders',
  SETTINGS: 'keepbox_settings',
  FEEDBACK: 'keepbox_feedback',
}

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
const write = (key, val) => localStorage.setItem(key, JSON.stringify(val))

export const getItems = () => read(KEYS.ITEMS, [])
export const saveItems = (items) => write(KEYS.ITEMS, items)

export const addItem = (item) => {
  const items = getItems()
  const newItem = {
    id: crypto.randomUUID(),
    starred: false, archived: false, deleted: false,
    reminder: null, description: '', folderId: null,
    autoCategory: item.category ?? '',
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...item,
  }
  saveItems([newItem, ...items])
  return newItem
}

export const updateItem = (id, patch) => {
  const items = getItems().map(i =>
    i.id === id ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i
  )
  saveItems(items)
  return items.find(i => i.id === id)
}

export const deleteItem = (id) => updateItem(id, { deleted: true })

export const permanentDelete = (id) => saveItems(getItems().filter(i => i.id !== id))

const defaultFolders = () => [{ id: 'default', name: 'General', createdAt: new Date().toISOString() }]

export const getFolders = () => read(KEYS.FOLDERS, defaultFolders())
export const saveFolders = (f) => write(KEYS.FOLDERS, f)

export const addFolder = (name) => {
  const folders = getFolders()
  const folder = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() }
  saveFolders([...folders, folder])
  return folder
}

export const updateFolder = (id, patch) => {
  saveFolders(getFolders().map(f => f.id === id ? { ...f, ...patch } : f))
}

export const deleteFolder = (id) => saveFolders(getFolders().filter(f => f.id !== id))

const defaultSettings = { theme: 'light', notifications: true, reminderToggle: true }
export const getSettings = () => read(KEYS.SETTINGS, defaultSettings)
export const updateSettings = (patch) => write(KEYS.SETTINGS, { ...getSettings(), ...patch })

export const addFeedback = (entry) => {
  const list = read(KEYS.FEEDBACK, [])
  write(KEYS.FEEDBACK, [...list, { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...entry }])
}
