import { useState, useEffect, useRef } from 'react';
import './ChannelModal.css';

const ChannelModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Channel name is required');
      return;
    }

    // Basic validation for channel name (letters, numbers, hyphens only, to look like discord)
    if (!/^[a-zA-Z0-9-]+$/.test(name)) {
      setError('Channel name can only contain letters, numbers, and hyphens');
      return;
    }

    setIsLoading(true);
    try {
      await onCreate(name, description);
    } catch (err) {
      setError(err.message || 'Failed to create channel');
      setIsLoading(false);
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Channel</h2>
          <p>Channels are where your team communicates. They're best when organized around a topic.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="channel-name">Channel Name</label>
              <input
                id="channel-name"
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="e.g. general, announcements"
                maxLength={30}
              />
            </div>

            <div className="form-group">
              <label htmlFor="channel-desc">Description (Optional)</label>
              <input
                id="channel-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this channel about?"
                maxLength={200}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? 'Creating...' : 'Create Channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChannelModal;
