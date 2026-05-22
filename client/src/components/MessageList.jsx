import { useRef, useEffect } from 'react';
import './MessageList.css';

// Generate a consistent color for a username
const getAvatarColor = (name) => {
  const colors = ['#5865f2', '#57f287', '#fee75c', '#eb459e', '#ed4245', '#f47b67', '#e8a12e', '#45ddc0'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Format timestamp (e.g., "Today at 2:30 PM", "Yesterday at 1:15 PM", "05/20/2024")
const formatTimestamp = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (isToday) return `Today at ${timeString}`;
  if (isYesterday) return `Yesterday at ${timeString}`;
  return `${date.toLocaleDateString()} ${timeString}`;
};

const MessageList = ({ messages, loading, channelName }) => {
  const listRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="messages-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Check if a message should show the header (avatar + username)
  // We hide it if it's from the same user within 5 minutes
  const shouldShowHeader = (msg, prevMsg) => {
    if (!prevMsg) return true;
    if (msg.sender._id !== prevMsg.sender._id) return true;
    
    const msgTime = new Date(msg.createdAt).getTime();
    const prevTime = new Date(prevMsg.createdAt).getTime();
    const fiveMinutes = 5 * 60 * 1000;
    
    return msgTime - prevTime > fiveMinutes;
  };

  return (
    <div className="message-list" ref={listRef}>
      <div className="channel-welcome">
        <div className="welcome-hash">#</div>
        <h2>Welcome to #{channelName}!</h2>
        <p>This is the start of the #{channelName} channel.</p>
        <div className="divider"></div>
      </div>

      {messages.length === 0 ? (
        <div className="no-messages">
          No messages here yet. Be the first to say hello!
        </div>
      ) : (
        messages.map((msg, index) => {
          const showHeader = shouldShowHeader(msg, messages[index - 1]);

          return (
            <div key={msg._id} className={`message-item ${showHeader ? 'has-header' : ''}`}>
              {showHeader ? (
                <div
                  className="message-avatar"
                  style={{ backgroundColor: getAvatarColor(msg.sender.username || 'U') }}
                >
                  {msg.sender.username?.charAt(0) || 'U'}
                </div>
              ) : (
                <div className="message-avatar hidden"></div>
              )}
              
              <div className="message-body">
                {showHeader && (
                  <div className="message-header">
                    <span className="message-username">{msg.sender.username}</span>
                    <span className="message-timestamp">
                      {formatTimestamp(msg.createdAt)}
                    </span>
                  </div>
                )}
                <div className="message-content">{msg.content}</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageList;
