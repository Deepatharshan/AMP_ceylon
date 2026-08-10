import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Carton Boxes',
  description: 'Premium corrugated carton boxes for safe global transit.',
  alternates: {
    canonical: '/carton-boxes',
  },
};

export default function Page() {
  return <ClientPage />;
}
