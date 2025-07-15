import React, { useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    const newMessages = [
      ...messages,
      {
        role: "user",
        content: input,
        file: file?.name || null,
      },
    ];
    setMessages(newMessages);
    setInput("");
    setFile(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (file) formData.append("file", file);

      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: data.result,
          },
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "Error: " + data.error,
          },
        ]);
      }
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Failed to connect to API.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hi, I'm your college assistant!</h1>
      <p className={styles.subtitle}>
        I can help with assignments, reminders, APA formatting, and more.
      </p>

      <div className={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.message} ${
              msg.role === "user" ? styles.user : styles.assistant
            }`}
          >
            <div>
              <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
            </div>
            {msg.file && (
              <div className={styles.fileLine}>📎 File uploaded: {msg.file}</div>
            )}
            <button
              className={styles.copyBtn}
              onClick={() => handleCopy(msg.content)}
            >
              Copy
            </button>
          </div>
        ))}
        {loading && <div className={styles.loading}>Typing...</div>}
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.textInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <input
          className={styles.fileInput}
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className={styles.sendBtn} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
