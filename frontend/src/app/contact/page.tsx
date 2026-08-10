import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch for wholesale inquiries and export partnerships.',
  alternates: {
    canonical: '/contact',
  },
};

export default function Page() {
  return <ClientPage />;
}
