import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ClientPage from './ClientPage';

export const REGIONS = [
  { slug: 'uk', name: 'the UK' },
  { slug: 'australia', name: 'Australia' },
  { slug: 'middle-east', name: 'the Middle East' },
  { slug: 'europe', name: 'Europe' },
  { slug: 'north-america', name: 'North America' },
];

export async function generateStaticParams() {
  return REGIONS.map((region) => ({
    region: region.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const regionData = REGIONS.find((r) => r.slug === resolvedParams.region);

  if (!regionData) {
    return {
      title: 'Market Not Found',
    };
  }

  return {
    title: `Wholesale Artificial Flowers Supplier in ${regionData.name} | AMP Ceylon`,
    description: `AMP Ceylon is a leading manufacturer and exporter of premium artificial botanicals, supplying wholesale markets across ${regionData.name}. Contact us for bulk orders and bespoke decor.`,
  };
}

export default async function Page({ params }: { params: Promise<{ region: string }> }) {
  const resolvedParams = await params;
  const regionData = REGIONS.find((r) => r.slug === resolvedParams.region);

  if (!regionData) {
    notFound();
  }

  return <ClientPage regionName={regionData.name} />;
}
