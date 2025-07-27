"use client"

import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/chats').then(res => setChats(res.data));
  }, [chatId]);

  const handleNewChat = async () => {
    const res = await axios.post('http://localhost:5000/api/chat');
    setChatId(res.data._id);
  };

  const handleDeleteChat = async (id) => {
    await axios.delete(`http://localhost:5000/api/${id}`);
    setChats(prev => prev.filter(chat => chat._id !== id));

    
    if (chatId === id) setChatId(null);
  };


  const handleEditChat = async (id, newTitle) => {
    const res = await axios.put(`http://localhost:5000/api/${id}`, {
      title: newTitle,
    });

    // Update title in chat list
    setChats(prev =>
      prev.map(chat =>
        chat._id === id ? { ...chat, title: res.data.title } : chat
      )
    );
  };


  return (
    <div className="flex h-screen">
      <Sidebar chatId={chatId} chats={chats} onNewChat={handleNewChat} onSelectChat={setChatId} onDeleteChat={handleDeleteChat} onEditChat={handleEditChat} selectedChatId={chatId} />
      <ChatBox chatId={chatId} />
    </div>
  );
}
