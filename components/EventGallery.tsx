'use client';

import { useEffect, useState } from 'react';

export default function EventGallery() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading events...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem' }}>Latest Event Photos</h1>
      {events.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px' }}>No events yet. Upload photos from the admin panel!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {events.map((event) => (
            <div key={event.sha} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <img src={event.url} alt={event.name} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <p style={{ padding: '15px', fontSize: '14px', background: '#f9f9f9' }}>{event.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
