import React, { useState } from "react";
import ChatBubble from "../components/ChatBubble";
import "../public/styles.css";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages([...newMessages, { role: "assistant", content: data.result }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "Error: " + data.error }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Failed to connect to API." }]);
    }

    setLoading(false);
  };

  const handleFileUpload = (e) => {
    const uploaded = e.target.files[0];
    setFile(uploaded);
    setMessages([...messages, { role: "user", content: `📎 File uploaded: ${uploaded.name}` }]);
  };

  return (
    <div className="container">
      <h1>Hi, I'm your college assistant!</h1>
      <p>I can help with assignments, reminders, APA formatting, and more.</p>

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} role={msg.role} content={msg.content} />
        ))}
        {loading && <p><em>Thinking...</em></p>}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <input type="file" onChange={handleFileUpload} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
