import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Manufacturing',
  description: 'State-of-the-art scalable production capabilities for artificial botanicals.',
  alternates: {
    canonical: '/manufacturing',
  },
};

export default function Page() {
  return <ClientPage />;
}
