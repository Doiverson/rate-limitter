const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

// Create a rate limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 50 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Asshole, too many requests🤮',
});

// Apply the rate limiting middleware to API calls
app.use('/api/rate-limit', apiLimiter, (req, res) => {
  if (res.statusCode !== 429) {
    res.send('PASSED');
  }
});

// Sample API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
