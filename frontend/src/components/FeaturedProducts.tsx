import Link from 'next/link';
import styles from './FeaturedProducts.module.css';
import { createClient } from '@/utils/supabase/server';
import ScrollFadeWrapper from './ScrollFadeWrapper';
import CategoryShowcase from './CategoryShowcase';

export default async function FeaturedProducts() {
  const supabase = await createClient();

  // First, check the total count of active products
  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .or('business_line.eq.FLORAL,business_line.is.null')
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
      .or('business_line.eq.FLORAL,business_line.is.null')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    productsToDisplay = data || [];
  } else {
    // Fetch products marked for homepage (using is_top_seller as the flag)
    const { data: featuredData } = await supabase
      .from('products')
      .select('*')
      .or('business_line.eq.FLORAL,business_line.is.null')
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
        .or('business_line.eq.FLORAL,business_line.is.null')
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
    <section className={styles.curation} style={{ backgroundColor: '#fff', paddingTop: '40px', paddingBottom: '40px' }}>
      <ScrollFadeWrapper className={styles.header}>
        <div>
          <p className={styles.preTitle}>Our Products</p>
          <h2 className={styles.title}>Which Products We Have</h2>
        </div>
        <Link href="/collections" className={styles.exploreLink}>
          Explore Full Catalog →
        </Link>
      </ScrollFadeWrapper>

      <ScrollFadeWrapper delay={200} className="w-full">
        <CategoryShowcase
          categoryLink="/collections"
          featuredImage={productsToDisplay[0]?.image_urls?.[0] || productsToDisplay[0]?.image_url || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop'}
          products={productsToDisplay.map(p => ({
            id: p.id,
            name: p.name,
            image: p.image_urls?.[0] || p.image_url || '/placeholder-product.jpg',
            price: p.price,
            slug: p.id,
            colors: p.colors || []
          }))}
        />
      </ScrollFadeWrapper>
    </section>
  );
}
