import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Corrugated Carton Boxes Manufacturer Sri Lanka | AMP Ceylon',
  description: 'High-quality, sustainable corrugated carton boxes manufactured in Sri Lanka. Custom packaging solutions designed for secure global transit and export.',
  alternates: {
    canonical: '/carton-boxes',
  },
};

export default function Page() {
  return <ClientPage />;
}
