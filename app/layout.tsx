import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Event Management',
  description: 'Event photo gallery and management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
