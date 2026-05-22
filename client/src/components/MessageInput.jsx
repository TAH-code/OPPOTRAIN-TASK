import { useState } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSend, channelName }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSend(content);
    setContent('');
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-wrapper">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Message #${channelName}`}
          autoComplete="off"
        />
        <button 
          type="submit" 
          className="send-btn"
          disabled={!content.trim()}
          title="Send message"
        >
          ➢
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
