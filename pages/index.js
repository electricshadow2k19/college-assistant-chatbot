import React, { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

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

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "1rem" }}>
      <h1>Hi, I'm your college assistant!</h1>
      <p>I can help with assignments, reminders, APA formatting, and more.</p>

      <div style={{ border: "1px solid #ccc", padding: 10, margin: "1rem 0", minHeight: 300 }}>
        {messages.map((msg, idx) => (
          <p key={idx}><strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}</p>
        ))}
        {loading && <p><em>Loading...</em></p>}
      </div>

      <input
        style={{ width: "80%", padding: 10 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage} style={{ padding: 10, marginLeft: 5 }}>Send</button>
    </div>
  );
}