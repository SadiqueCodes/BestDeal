// Quick script to add sample products to Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function addSampleProducts() {
  console.log('Adding sample products to database...\n');

  const sampleProducts = [
    {
      name: 'Apple iPhone 15 Pro',
      brand: 'Apple',
      category: 'Electronics',
      image_url: 'https://m.media-amazon.com/images/I/81dT7CUY6GL._SL1500_.jpg',
      description: 'Latest iPhone with titanium design',
    },
    {
      name: 'Nike Air Max 270',
      brand: 'Nike',
      category: 'Shoes',
      image_url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-shoes-2V5C4p.png',
      description: 'Comfortable running shoes',
    },
    {
      name: 'Sony WH-1000XM5',
      brand: 'Sony',
      category: 'Electronics',
      image_url: 'https://m.media-amazon.com/images/I/61vJN++APCL._SL1500_.jpg',
      description: 'Noise cancelling headphones',
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      category: 'Electronics',
      image_url: 'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-s928-sm-s928bzkqins-thumb-539573217',
      description: 'Premium Android smartphone',
    },
  ];

  for (const product of sampleProducts) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error(`❌ Error adding ${product.name}:`, error.message);
    } else {
      console.log(`✅ Added: ${product.name}`);

      // Add sample price
      const { error: priceError } = await supabase
        .from('prices')
        .insert([{
          product_id: data.id,
          store_id: 'amazon',
          current_price: Math.floor(Math.random() * 50000) + 10000,
          original_price: Math.floor(Math.random() * 60000) + 20000,
          in_stock: true,
        }]);

      if (priceError) {
        console.error(`  ❌ Error adding price:`, priceError.message);
      } else {
        console.log(`  ✅ Added price\n`);
      }
    }
  }

  console.log('✅ Done! Check your app or Supabase dashboard.');
  process.exit(0);
}

addSampleProducts().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
