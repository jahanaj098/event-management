export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Event Management</h1>
      <p>Homepage is working!</p>
      <a href="/admin" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go to Admin Panel
      </a>
    </div>
  );
}
