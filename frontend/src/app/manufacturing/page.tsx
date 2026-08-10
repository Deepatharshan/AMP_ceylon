import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Sustainable Artificial Flower Production & Facilities | AMP Ceylon',
  description: 'Explore our state-of-the-art manufacturing facilities in Sri Lanka. We specialize in the sustainable production of export-grade artificial flowers and plants.',
  alternates: {
    canonical: '/manufacturing',
  },
};

export default function Page() {
  return <ClientPage />;
}
