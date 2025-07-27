import React, { useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';

export default function Sidebar({
  chatId,
  chats,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onEditChat,
  selectedChatId
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleEdit = (chat) => {
    setEditingId(chat._id);
    setEditTitle(chat.title);
  };

  const handleEditSubmit = (id) => {
    onEditChat(id, editTitle);
    setEditingId(null);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      //to Return time like 11:09 AM
      return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      // to Return short date like Apr 13
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      });
    }
  };


  return (
    <div className="w-64 bg-[#202123] text-white h-screen flex flex-col p-4 border-r border-gray-700">
      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 bg-[#343541] hover:bg-[#40414f] text-white p-2 rounded mb-4 cursor-pointer"
      >
        <Plus size={18} />
        New Chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-2">
        {chats.map(chat => (
          <div
            key={chat._id}
            title={`Created: ${new Date(chat.created_at).toLocaleString()}`}
            className={`group p-3 rounded cursor-pointer transition ${chat._id === selectedChatId ? 'bg-[#2a2b32]' : 'hover:bg-[#2a2b32]'
              }`}
          >
            <div className="flex justify-between items-center">
              {editingId === chat._id ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleEditSubmit(chat._id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSubmit(chat._id);
                  }}
                  className="bg-transparent border-b border-gray-500 outline-none w-full text-white"
                  autoFocus
                />
              ) : (
                <div onClick={() => onSelectChat(chat._id)} className="flex-1 truncate">
                  <div className="font-medium">
                    {chat.title && !chat.title.startsWith('Chat ') ? chat.title : 'New Chat'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTime(chat.created_at)}
                  </div>
                </div>

              )}

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <Pencil
                  size={16}
                  onClick={() => handleEdit(chat)}
                  className="hover:text-blue-400"
                />
                <Trash2
                  size={16}
                  onClick={() => onDeleteChat(chat._id)}
                  className="hover:text-red-400"
                />
              </div>
            </div>

            {chat.preview && (
              <div
                onClick={() => onSelectChat(chat._id)}
                className="text-xs text-gray-400 mt-1 truncate"
              >
                {chat.preview}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
