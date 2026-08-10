import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Wholesale Artificial Floral Arrangements & Decor | AMP Ceylon',
  description: 'Browse our extensive catalog of wholesale artificial floral arrangements, premium botanical decor, and bespoke lifelike plants for global retail markets.',
  alternates: {
    canonical: '/collections',
  },
};

export default function Page() {
  return <ClientPage />;
}
