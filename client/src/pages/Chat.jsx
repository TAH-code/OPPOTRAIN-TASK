import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import socket from '../utils/socket';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import ChannelModal from '../components/ChannelModal';
import './Chat.css';

const Chat = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Connect socket on mount
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  // Load channels
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await api.get('/channels');
        setChannels(res.data);
        // Auto-select first channel
        if (res.data.length > 0 && !activeChannel) {
          setActiveChannel(res.data[0]);
        }
      } catch (error) {
        console.error('Failed to load channels:', error);
      }
    };
    fetchChannels();
  }, []);

  // Load messages when active channel changes
  useEffect(() => {
    if (!activeChannel) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await api.get(`/messages/${activeChannel._id}`);
        setMessages(res.data);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoadingMessages(false);
      }
    };

    // Join socket room for this channel
    socket.emit('joinChannel', activeChannel._id);
    fetchMessages();

    // Cleanup: leave channel room
    return () => {
      socket.emit('leaveChannel', activeChannel._id);
    };
  }, [activeChannel?._id]);

  // Listen for incoming messages
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      // Only add if it belongs to the active channel
      if (activeChannel && message.channel === activeChannel._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [activeChannel?._id]);

  // Send message
  const handleSendMessage = useCallback((content) => {
    if (!activeChannel || !content.trim()) return;

    socket.emit('sendMessage', {
      content: content.trim(),
      channelId: activeChannel._id,
      senderId: user._id,
    });
  }, [activeChannel, user]);

  // Create channel
  const handleCreateChannel = async (name, description) => {
    try {
      const res = await api.post('/channels', { name, description });
      setChannels((prev) => [...prev, res.data]);
      setActiveChannel(res.data);
      setShowModal(false);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create channel');
    }
  };

  // Select channel
  const handleSelectChannel = (channel) => {
    if (activeChannel?._id === channel._id) return;
    setActiveChannel(channel);
  };

  return (
    <div className="chat-page">
      <Sidebar
        channels={channels}
        activeChannel={activeChannel}
        onSelectChannel={handleSelectChannel}
        onCreateChannel={() => setShowModal(true)}
      />
      <div className="chat-main">
        {activeChannel ? (
          <>
            <div className="chat-header">
              <span className="hash">#</span>
              <span className="channel-name">{activeChannel.name}</span>
              {activeChannel.description && (
                <>
                  <div className="channel-divider" />
                  <span className="channel-description">{activeChannel.description}</span>
                </>
              )}
            </div>
            <MessageList
              messages={messages}
              loading={loadingMessages}
              channelName={activeChannel.name}
            />
            <MessageInput
              onSend={handleSendMessage}
              channelName={activeChannel.name}
            />
          </>
        ) : (
          <div className="chat-empty">
            <div className="empty-icon">💬</div>
            <h2>Welcome to Discord Clone</h2>
            <p>Select a channel or create one to start chatting</p>
          </div>
        )}
      </div>

      {showModal && (
        <ChannelModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateChannel}
        />
      )}
    </div>
  );
};

export default Chat;
