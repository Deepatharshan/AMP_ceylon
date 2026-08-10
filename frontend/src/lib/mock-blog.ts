export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image_url: string;
  category: string;
  tags: string[];
}

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'top-5-artificial-floral-trends-european-retail',
    title: 'Top 5 Artificial Floral Trends in European Retail for 2024',
    excerpt: 'Discover the latest trends in hyper-realistic artificial botanicals that are dominating European retail and interior design sectors.',
    content: `
      <h2>The Shift Towards Hyper-Realism</h2>
      <p>European retail markets are seeing a massive shift away from cheap, plastic-looking flowers towards hyper-realistic, sustainably produced artificial botanicals. As a premier wholesale artificial flowers supplier, AMP Ceylon has noted a 40% increase in demand for hand-painted silk and precision-molded polymers.</p>
      
      <h2>1. Sustainable and Eco-Friendly Materials</h2>
      <p>Consumers are demanding eco-friendly alternatives. Retailers sourcing bulk artificial foliage are now prioritizing manufacturers who use recycled plastics and sustainable dyes.</p>
      
      <h2>2. Biophilic Office Design</h2>
      <p>Corporate spaces are incorporating permanent botanical installations. Large-scale artificial olive trees and ficus trees are top sellers for B2B supply chains.</p>
      
      <h2>3. Dried and Preserved Aesthetics</h2>
      <p>The "dried flower" look remains incredibly popular, but with the durability of artificial materials. Our bespoke collections mimic the exact texture of dried pampas and eucalyptus.</p>
      
      <h2>4. Deep, Moody Color Palettes</h2>
      <p>Moving away from pastels, autumn and winter collections are focusing on deep burgundies, rich terracottas, and midnight blues. Our proprietary custom dyeing systems allow us to match any Pantone color for wholesale orders.</p>
      
      <h2>5. Minimalist Ikebana Arrangements</h2>
      <p>Retailers are ordering sparse, architectural stems in bulk. The focus is on the structural beauty of individual branches rather than dense bouquets.</p>
    `,
    date: '2024-01-15',
    author: 'AMP Ceylon Design Team',
    image_url: '/heritage_main_floral.jpg',
    category: 'Industry Trends',
    tags: ['Europe', 'Trends', 'Wholesale', 'Design']
  },
  {
    id: '2',
    slug: 'how-to-source-bulk-artificial-flowers',
    title: 'How to Source Bulk Artificial Flowers: A Buyer\'s Guide',
    excerpt: 'A comprehensive guide for global retailers on sourcing high-quality artificial flowers in bulk directly from manufacturers.',
    content: `
      <h2>Understanding the Global Supply Chain</h2>
      <p>Sourcing bulk artificial flowers requires finding a reliable wholesale supplier who can guarantee consistent quality, timely shipping, and ethical manufacturing practices.</p>
      
      <h2>Why Source from Sri Lanka?</h2>
      <p>Sri Lanka has emerged as a hub for premium artisanal manufacturing. Unlike mass-production facilities that prioritize volume over quality, AMP Ceylon focuses on hand-crafted excellence, making us the ideal partner for high-end retail brands.</p>
      
      <h2>Quality Control Indicators</h2>
      <ul>
        <li><strong>Material Quality:</strong> Look for premium polyesters, silks, and UV-resistant polymers.</li>
        <li><strong>Color Fastness:</strong> Ensure the manufacturer uses advanced dyeing techniques so products don't fade in retail displays.</li>
        <li><strong>Customization:</strong> A true manufacturing partner can alter molds and colors to your exact specifications.</li>
      </ul>
      
      <h2>Logistics and Shipping</h2>
      <p>When ordering wholesale artificial floral arrangements, consider volumetric weight. Our custom corrugated carton boxes (manufactured in-house) are designed to maximize container space while protecting delicate petals during transit.</p>
    `,
    date: '2024-02-02',
    author: 'J.V. Udesh',
    image_url: '/images/artisan_arranging_flowers.jpg',
    category: 'Supply Chain',
    tags: ['Sourcing', 'Wholesale', 'Logistics']
  },
  {
    id: '3',
    slug: 'environmental-benefits-sustainable-artificial-botanicals',
    title: 'The Environmental Benefits of Sustainable Artificial Botanicals',
    excerpt: 'Exploring how long-lasting artificial flowers can reduce the carbon footprint associated with the cut-flower industry.',
    content: `
      <h2>Rethinking Floral Sustainability</h2>
      <p>The fresh cut-flower industry often relies on intensive water usage, chemical pesticides, and air-freight logistics. High-quality artificial botanicals offer a surprisingly sustainable alternative for long-term decor.</p>
      
      <h2>Longevity and Reusability</h2>
      <p>Our premium artificial flowers are designed to last for years, not days. This drastically reduces waste in commercial settings like hotels, restaurants, and corporate offices.</p>
      
      <h2>Eco-Friendly Manufacturing</h2>
      <p>At AMP Ceylon, our state-of-the-art facility in Katunayake prioritizes sustainable production methods, including water recycling in our dyeing processes and utilizing eco-friendly packaging materials.</p>
      
      <h2>The Future of Decor</h2>
      <p>As a leading exporter of artificial botanicals, we are continuously researching new bio-plastics and recycled materials to further minimize our environmental impact.</p>
    `,
    date: '2024-03-10',
    author: 'AMP Ceylon Sustainability Team',
    image_url: '/images/meticulous_floral_assembly.jpg',
    category: 'Sustainability',
    tags: ['Eco-Friendly', 'Manufacturing']
  }
];
