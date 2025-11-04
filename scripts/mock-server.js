const express = require('express');
const cors = require('cors');
const { mockProductPrices, mockDeals } = require('../src/services/mockData');

const app = express();
app.use(cors());
app.use(express.json());

// Simple serializer to convert Dates to ISO strings
const serialize = obj => JSON.parse(JSON.stringify(obj, (k, v) => (v instanceof Date ? v.toISOString() : v)));

app.get('/products', (req, res) => {
  res.json(serialize(mockProductPrices));
});

app.get('/products/:id', (req, res) => {
  const item = mockProductPrices.find(p => p.product.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(serialize(item));
});

app.get('/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const results = mockProductPrices.filter(p =>
    p.product.name.toLowerCase().includes(q) ||
    p.product.brand.toLowerCase().includes(q) ||
    p.product.category.toLowerCase().includes(q)
  );
  res.json(serialize(results));
});

app.get('/deals', (req, res) => {
  res.json(serialize(mockDeals));
});

const port = process.env.MOCK_SERVER_PORT || 3333;
app.listen(port, () => console.log(`Mock server running on http://localhost:${port}`));
