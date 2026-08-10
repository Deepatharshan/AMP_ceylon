import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'About Us',
  description: "Learn about AMP Ceylon's heritage and commitment to excellence.",
  alternates: {
    canonical: '/about',
  },
};

export default function Page() {
  return <ClientPage />;
}
