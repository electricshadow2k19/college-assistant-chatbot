// components/ChatBubble.js
export default function ChatBubble({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={`chat-bubble ${isUser ? 'user' : 'assistant'}`}>
      <strong>{isUser ? 'You' : 'AI'}:</strong>
      <span>{content}</span>
      {!isUser && (
        <button onClick={() => navigator.clipboard.writeText(content)} className="copy-btn">
          Copy
        </button>
      )}
    </div>
  );
}
