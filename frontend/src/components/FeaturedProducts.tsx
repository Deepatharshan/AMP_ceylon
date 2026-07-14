import Link from 'next/link';
import Image from 'next/image';
import styles from './FeaturedProducts.module.css';
import { createClient } from '@/utils/supabase/server';
import ScrollFadeWrapper from './ScrollFadeWrapper';
import { ShirtParallaxCard } from '@/components/ui/shirt-parallax-card';

export default async function FeaturedProducts() {
  const supabase = await createClient();

  // First, check the total count of active products
  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (countError) {
    console.error('Error fetching products count:', countError);
    return null;
  }

  const totalProducts = count || 0;
  let productsToDisplay: any[] = [];

  if (totalProducts <= 6) {
    // If 6 or fewer products, just show them all
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    productsToDisplay = data || [];
  } else {
    // Fetch products marked for homepage (using is_top_seller as the flag)
    const { data: featuredData } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_top_seller', true)
      .order('created_at', { ascending: false })
      .limit(6);

    productsToDisplay = featuredData || [];

    // If less than 6 are checked, pad with other latest products
    if (productsToDisplay.length < 6) {
      const remainingSlots = 6 - productsToDisplay.length;
      const existingIds = productsToDisplay.map(p => p.id);

      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(remainingSlots);

      if (existingIds.length > 0) {
        // Exclude the ones we already fetched
        query = query.not('id', 'in', `(${existingIds.join(',')})`);
      }

      const { data: paddingData } = await query;
      if (paddingData) {
        productsToDisplay = [...productsToDisplay, ...paddingData];
      }
    }
  }

  // If there are absolutely no products, don't render the section
  if (productsToDisplay.length === 0) {
    return null;
  }

  return (
    <section className={styles.curation} style={{ backgroundColor: '#fff' }}>
      <ScrollFadeWrapper className={styles.header}>
        <div>
          <p className={styles.preTitle}>Our Products</p>
          <h2 className={styles.title}>Which Products We Have</h2>
        </div>
        <Link href="/collections" className={styles.exploreLink}>
          Explore Full Catalog →
        </Link>
      </ScrollFadeWrapper>

      <div className={styles.grid}>
        {productsToDisplay.map((product, index) => {
          const imageUrl = product.image_urls?.[0] || product.image_url || 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop';
          
          return (
            <ScrollFadeWrapper key={product.id} className="flex justify-center" delay={(index + 1) * 100}>
              <ShirtParallaxCard
                id={product.id}
                title={product.name}
                description={product.description || 'Premium quality product from AMP Ceylon.'}
                price={`$${Number(product.price).toFixed(2)}`}
                imageUrl={imageUrl}
              />
            </ScrollFadeWrapper>
          );
        })}
      </div>
    </section>
  );
}
