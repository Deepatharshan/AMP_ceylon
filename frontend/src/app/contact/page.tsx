import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Contact Our Artificial Decor Export Team | AMP Ceylon',
  description: 'Get in touch with AMP Ceylon for wholesale inquiries, custom botanical manufacturing, and global export partnerships. Located in Katunayake, Sri Lanka.',
  alternates: {
    canonical: '/contact',
  },
};

export default function Page() {
  return <ClientPage />;
}
