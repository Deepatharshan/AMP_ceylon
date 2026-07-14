import { getOffer } from '../../actions';
import EditOfferClient from './EditOfferClient';

export default async function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const offer = await getOffer(resolvedParams.id);

  if (!offer) {
    return <div className="p-8 text-red-500">Offer not found</div>;
  }

  return <EditOfferClient initialOffer={offer} />;
}
