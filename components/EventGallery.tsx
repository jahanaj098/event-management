'use client';

import { useEffect, useState } from 'react';

export default function EventGallery() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []));
  }, []);

  return (
    <div className="gallery">
      <h1>Latest Event Photos</h1>
      <div className="grid">
        {events.map((event) => (
          <div key={event.sha} className="photo">
            <img src={event.url} alt={event.name} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .gallery {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        h1 {
          text-align: center;
          margin-bottom: 40px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .photo img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
