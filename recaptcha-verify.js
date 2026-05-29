// Simple Node.js helper to verify Google reCAPTCHA v2/v3 tokens server-side.
// Usage:
//   1) Install dependencies: npm install express
//   2) Run: node recaptcha-verify.js
//   3) POST JSON { token: '<recaptcha-token>' } to http://localhost:3000/verify-recaptcha

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || '6LdJWf8sAAAAABJA8hm921hQr1YmGUD1yZMZVnsE';

app.use(express.json());

app.post('/verify-recaptcha', async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ success: false, error: 'missing token' });
  }

  try {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`;
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, error: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`reCAPTCHA verification helper running on http://localhost:${PORT}`);
  console.log('Set RECAPTCHA_SECRET_KEY in env to avoid hardcoding your secret.');
});
