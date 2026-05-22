import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

// Generate a consistent color for a username
const getAvatarColor = (name) => {
  const colors = ['#5865f2', '#57f287', '#fee75c', '#eb459e', '#ed4245', '#f47b67', '#e8a12e', '#45ddc0'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Sidebar = ({ channels, activeChannel, onSelectChannel, onCreateChannel }) => {
  const { user, logout } = useAuth();

  return (
    <div className="sidebar">
      {/* Server header */}
      <div className="sidebar-header">
        <div className="server-icon">💬</div>
        <span className="server-name">Discord Clone</span>
      </div>

      {/* Channel list */}
      <div className="channel-section">
        <div className="channel-section-header">
          <span>Text Channels</span>
          <button
            className="add-channel-btn"
            onClick={onCreateChannel}
            title="Create Channel"
          >
            +
          </button>
        </div>

        {channels.map((channel) => (
          <div
            key={channel._id}
            className={`channel-item ${activeChannel?._id === channel._id ? 'active' : ''}`}
            onClick={() => onSelectChannel(channel)}
          >
            <span className="channel-hash">#</span>
            <span className="channel-label">{channel.name}</span>
          </div>
        ))}
      </div>

      {/* User panel */}
      <div className="user-panel">
        <div
          className="user-avatar"
          style={{ backgroundColor: getAvatarColor(user?.username || 'U') }}
        >
          {user?.username?.charAt(0) || 'U'}
        </div>
        <div className="user-info">
          <div className="user-name">{user?.username}</div>
          <div className="user-status">Online</div>
        </div>
        <button className="logout-btn" onClick={logout} title="Logout">
          ⏻
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
