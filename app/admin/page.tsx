'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (session) {
      fetchEvents();
    }
  }, [session]);

  const fetchEvents = async () => {
    const response = await fetch('/api/events');
    const data = await response.json();
    setEvents(data.events || []);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert('Event photo uploaded successfully! Changes will deploy shortly.');
        setTitle('');
        (e.target as HTMLFormElement).reset();
        setTimeout(fetchEvents, 3000); // Wait for GitHub to update
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (path: string, sha: string) => {
    if (!confirm('Delete this event photo?')) return;

    try {
      const response = await fetch('/api/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, sha }),
      });

      if (response.ok) {
        alert('Photo deleted! Changes will deploy shortly.');
        setTimeout(fetchEvents, 3000);
      }
    } catch (error) {
      alert('Delete failed');
    }
  };

  if (status === 'loading') {
    return <div className="container">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="container">
        <h1>Admin Panel</h1>
        <button onClick={() => signIn('github')}>
          Sign in with GitHub
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Event Management Admin</h1>
        <div>
          <span>Welcome, {session.user?.email}</span>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      </div>

      <div className="upload-section">
        <h2>Upload New Event Photo</h2>
        <form onSubmit={handleUpload}>
          <input
            type="text"
            name="title"
            placeholder="Event title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="file"
            name="file"
            accept="image/*"
            required
          />
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      </div>

      <div className="events-section">
        <h2>Existing Events ({events.length})</h2>
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.sha} className="event-card">
              <img src={event.url} alt={event.name} />
              <p>{event.name}</p>
              <button onClick={() => handleDelete(event.path, event.sha)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .upload-section {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        button {
          padding: 10px 20px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:disabled {
          background: #ccc;
        }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        .event-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }
        .event-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .event-card p {
          padding: 10px;
          font-size: 14px;
        }
        .event-card button {
          width: 100%;
          background: #ff4444;
        }
      `}</style>
    </div>
  );
}
