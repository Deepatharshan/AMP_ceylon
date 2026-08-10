import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Our Story | Premium Artificial Botanical Manufacturer | AMP Ceylon',
  description: 'Established in 1984, AMP Ceylon is a world-class artificial botanical manufacturer based in Sri Lanka, supplying premium decor to over 50 countries globally.',
  alternates: {
    canonical: '/about',
  },
};

export default function Page() {
  return <ClientPage />;
}
