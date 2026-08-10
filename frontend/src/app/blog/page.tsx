import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Blog & Industry Insights | AMP Ceylon',
  description: 'Read the latest insights on artificial floral decor trends, sustainable botanical manufacturing, and global export logistics from AMP Ceylon.',
  alternates: {
    canonical: '/blog',
  },
};

export default function Page() {
  return <ClientPage />;
}
