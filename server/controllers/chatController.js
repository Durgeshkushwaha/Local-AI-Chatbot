const Chat = require('../models/Chat');
const Message = require('../models/Message');
const axios = require('axios');

module.exports = {
    createChat: async (req, res) => {
        const chat = new Chat({ title: 'Chat ' + Date.now() });
        await chat.save();
        res.json({ _id: chat._id });
    },

    listChats: async (req, res) => {
        const chats = await Chat.find().sort({ created_at: -1 });
        res.json(chats);
    },

    deleteChat: async (req, res) => {
        const { chatId } = req.params;

        try {
            await Chat.findByIdAndDelete(chatId);
           
            res.json({ message: 'Chat deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: "Error deleting chat", error: err });
        }
    },

    editChatTitle: async (req, res) => {
        const { chatId } = req.params;
        const { title } = req.body;

        try {
            const chat = await Chat.findByIdAndUpdate(
                chatId,
                { title },
                { new: true }
            );

            if (!chat) return res.status(404).json({ message: "Chat not found" });

            res.json(chat);
        } catch (err) {
            res.status(500).json({ message: "Error updating title", error: err });
        }
    },

    getMessages: async (req, res) => {
        const messages = await Message.find({ chat_id: req.params.chatId }).sort({ timestamp: 1 });
        res.json(messages);
    },

    sendMessage: async (req, res) => {
        const { content } = req.body;
        const { chatId } = req.params;


        // Save user message
        await Message.create({ chat_id: chatId, role: 'user', content });

        // 💡 Update chat title if default
        const chat = await Chat.findById(chatId);
        if (chat && chat.title.startsWith('Chat ')) {
            const previewTitle = content.slice(0, 30); // First 30 chars
            chat.title = previewTitle || 'New Chat';
            await chat.save();
        }
        // Setup streaming response
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.flushHeaders();

        const ollamaRes = await axios.post(
            'http://127.0.0.1:11434/api/generate',
            { model: 'gemma3:1b', prompt: content, stream: true },
            { responseType: 'stream' }
        );

        let fullResponse = '';
        ollamaRes.data.on('data', chunk => {
            const lines = chunk.toString().split('\n');
            for (const line of lines) {
                if (!line.trim()) continue;
                const data = JSON.parse(line);
                if (data.done) {

                    Message.create({ chat_id: chatId, role: 'assistant', content: fullResponse });
                    res.end();
                    return;
                }
                fullResponse += data.response;

                res.write(data.response);
            }
        });


        req.on('close', () => {
            ollamaRes.data.destroy();
        });
    }
};
