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
    <div className="gallery">
      <h1>Latest Event Photos</h1>
      {events.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px' }}>No events yet. Upload photos from the admin panel!</p>
      ) : (
        <div className="grid">
          {events.map((event) => (
            <div key={event.sha} className="photo">
              <img src={event.url} alt={event.name} />
              <p>{event.name}</p>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .gallery {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        h1 {
          text-align: center;
          margin-bottom: 40px;
          font-size: 2.5rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .photo {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .photo img {
          width: 100%;
          height: 250px;
          object-fit: cover;
        }
        .photo p {
          padding: 15px;
          font-size: 14px;
          background: #f9f9f9;
        }
      `}</style>
    </div>
  );
}
