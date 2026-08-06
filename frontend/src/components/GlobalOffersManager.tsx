'use client';

import { useState } from 'react';
import GlobalOffer from './GlobalOffer';

export default function GlobalOffersManager({ offers }: { offers: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // When an offer is fully dismissed (i.e. closed and user can move on to the next),
  // we want to trigger the next one.
  const handleOfferDismissed = (offerId: string) => {
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <>
      {offers.map((offer, index) => {
        // Only the current offer in the sequence gets to auto-open.
        // Once the user closes it, currentIndex increments, allowing the next one to autoOpen.
        const shouldAutoOpen = index === currentIndex;
        return (
          <GlobalOffer 
            key={offer.id} 
            offer={offer} 
            autoOpen={shouldAutoOpen} 
            onDismiss={() => handleOfferDismissed(offer.id)} 
          />
        );
      })}
    </>
  );
}
