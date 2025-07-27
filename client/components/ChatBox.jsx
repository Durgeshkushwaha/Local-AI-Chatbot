import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function ChatBox({ chatId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [streamingMsg, setStreamingMsg] = useState('');
    const controllerRef = useRef(null);

    useEffect(() => {
        if (chatId) {
            axios.get(`http://localhost:5000/api/chat/${chatId}`).then(res => setMessages(res.data));
        }
    }, [chatId]);

    const handleSend = async () => {
        if (!chatId) {
            alert("Chat ID is missing. Please start a new chat first.");
            return;
        }

        try {
            setMessages(prev => [...prev, { role: 'user', content: input }]);
            setInput('');
            setStreamingMsg('');

            controllerRef.current = new AbortController();

            const response = await fetch(`http://localhost:5000/api/chat/${chatId}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: input }),
                signal: controllerRef.current.signal
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Fetch failed:', errorText);
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let botMessage = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                botMessage += chunk;
                setStreamingMsg(botMessage);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: botMessage }]);
            setStreamingMsg('');
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('Message fetch was aborted.');
            } else {
                console.error('Error while sending message:', err);
            }
        }
    };




    const handleStop = () => {
        controllerRef.current?.abort();
        setStreamingMsg('');
    };

    const stripMarkdown = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/_(.*?)_/g, '$1');
    };


    return (
        <div className="flex-1 p-4 flex flex-col">
            <div className="flex-1 overflow-auto mb-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`mb-4 ${msg.role === 'user' ? 'text-left' : 'text-left'}`}
                    >
                        <b>{msg.role === 'user' ? 'You' : 'Bot'}:<br /></b>
                        <div className="mt-2">{stripMarkdown(msg.content)}</div>
                    </div>
                ))}
                {streamingMsg && (
                    <div className="text-left mb-6">
                        <b>Bot:</b>
                        <div className="mt-4">{streamingMsg} <span className="animate-pulse">⏳</span></div>
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                <input
                    value={input}
                    placeholder='Type your message...'
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    className="border flex-1 p-2 rounded"
                />
                <button onClick={handleSend} className="bg-blue-600 text-white px-4 rounded cursor-pointer">Send</button>
                <button onClick={handleStop} className="bg-red-500 text-white px-4 rounded cursor-pointer">Stop</button>
            </div>
        </div>
    );
}
