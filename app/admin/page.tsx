'use client';

export const dynamic = 'force-dynamic';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

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
        alert('Event photo uploaded successfully!');
        setTitle('');
        (e.target as HTMLFormElement).reset();
        setTimeout(fetchEvents, 3000);
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
        alert('Photo deleted!');
        setTimeout(fetchEvents, 3000);
      }
    } catch (error) {
      alert('Delete failed');
    }
  };

  if (status === 'loading') {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!session) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Admin Panel</h1>
        <p style={{ marginBottom: '20px' }}>Please sign in to manage events</p>
        <button onClick={() => signIn('github')} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          Sign in with GitHub
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
        <h1>Event Management Admin</h1>
        <div>
          <span style={{ marginRight: '10px' }}>Welcome, {session.user?.email}</span>
          <button onClick={() => signOut()} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2>Upload New Event Photo</h2>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
          <input
            type="text"
            name="title"
            placeholder="Event title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            style={{ padding: '10px' }}
          />
          <button
            type="submit"
            disabled={uploading}
            style={{
              padding: '10px 20px',
              background: uploading ? '#ccc' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: uploading ? 'not-allowed' : 'pointer'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      </div>

      <div>
        <h2>Existing Events ({events.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {events.map((event) => (
            <div key={event.sha} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={event.url} alt={event.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <p style={{ padding: '10px', fontSize: '14px' }}>{event.name}</p>
              <button
                onClick={() => handleDelete(event.path, event.sha)}
                style={{ width: '100%', padding: '10px', background: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
