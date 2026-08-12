import Link from 'next/link';
import styles from './FeaturedProducts.module.css';
import { createClient } from '@/utils/supabase/server';
import ScrollFadeWrapper from './ScrollFadeWrapper';
import CategoryShowcase from './CategoryShowcase';

export default async function FeaturedProducts() {
  const supabase = await createClient();

  // Fetch all active products, sorting by is_featured_home (true first) then by created_at
  const { data: productsData, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .or('business_line.eq.FLORAL,business_line.is.null')
    .eq('is_active', true)
    .order('is_featured_home', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error('Error fetching featured products:', fetchError);
    return null;
  }

  const productsToDisplay = productsData || [];

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
            description: p.description || '',
            colors: p.colors || [],
            is_top_seller: p.is_top_seller,
            is_new_collection: p.is_new_collection,
            is_limited_product: p.is_limited_product
          }))}
        />
      </ScrollFadeWrapper>
    </section>
  );
}
