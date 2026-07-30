import { createClient } from '@/utils/supabase/server';
import CategoryShowcase from './CategoryShowcase';

export default async function FeaturedCategories() {
  const supabase = await createClient();

  // Fetch a few categories to showcase
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .limit(2); // Show top 2 categories for now

  if (!categories || categories.length === 0) return null;

  const showcases = [];

  for (const cat of categories) {
    // Fetch top products for this category
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('category', cat.name)
      .eq('is_active', true)
      .limit(3); // We need 3 products for the showcase

    if (products && products.length >= 3) {
      showcases.push(
        <CategoryShowcase
          key={cat.id}
          title={`SHOP ${cat.name}`}
          description={`Explore our premium collection of ${cat.name}. From classic essentials to the latest trends, find everything you need to elevate your style.`}
          categoryLink={`/collections?category=${encodeURIComponent(cat.name)}`}
          featuredImage={products[0].images[0]} // Fallback to first product image if no category image exists
          products={products.map(p => ({
            id: p.id,
            name: p.name,
            image: p.images[0],
            price: p.price,
            slug: p.id
          }))}
        />
      );
    }
  }

  return (
    <div className="w-full bg-white flex flex-col gap-8 py-12">
      {showcases}
    </div>
  );
}
