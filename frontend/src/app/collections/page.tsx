import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Our Collections',
  description: 'Browse our premium artificial floral arrangements and decor.',
  alternates: {
    canonical: '/collections',
  },
};

export default function Page() {
  return <ClientPage />;
}
