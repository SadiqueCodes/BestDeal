// Add sample products using service role key (bypasses RLS)
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// You need to get your service role key from Supabase Dashboard → Settings → API
// IMPORTANT: Never commit this key to git! Add it to .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function addSampleProducts() {
  console.log('🚀 Adding sample products to database...\n');

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
    {
      name: 'MacBook Air M2',
      brand: 'Apple',
      category: 'Electronics',
      image_url: 'https://m.media-amazon.com/images/I/71vFKBpKakL._SL1500_.jpg',
      description: '13-inch laptop with M2 chip',
    },
    {
      name: 'Adidas Ultraboost 22',
      brand: 'Adidas',
      category: 'Shoes',
      image_url: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GX5915_01_standard.jpg',
      description: 'Premium running shoes',
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
      continue;
    }

    console.log(`✅ Added product: ${product.name}`);

    // Add sample prices from multiple stores
    const stores = ['amazon', 'flipkart'];
    for (const store of stores) {
      const basePrice = Math.floor(Math.random() * 50000) + 10000;
      const { error: priceError } = await supabase
        .from('prices')
        .insert([{
          product_id: data.id,
          store_id: store,
          current_price: basePrice,
          original_price: basePrice + Math.floor(Math.random() * 10000),
          discount: Math.floor(Math.random() * 30) + 5,
          in_stock: true,
        }]);

      if (priceError) {
        console.error(`  ❌ Error adding ${store} price:`, priceError.message);
      } else {
        console.log(`  ✅ Added price for ${store}`);
      }
    }
    console.log('');
  }

  console.log('✅ Done! Now restart your app to see the products.');
  process.exit(0);
}

addSampleProducts().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  console.log('\n💡 Make sure you have:');
  console.log('   1. Run the supabase-schema.sql in Supabase SQL Editor');
  console.log('   2. Added SUPABASE_SERVICE_KEY to your .env file');
  console.log('      Get it from: Supabase Dashboard → Settings → API → service_role key');
  process.exit(1);
});
