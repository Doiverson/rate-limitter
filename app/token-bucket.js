const express = require('express');

const app = express();
const port = 3000;

// Create a token bucket rate limiter
const buckets = new Map();
const BUCKET_CAPACITY = 50;
const REFILL_RATE = 1; // tokens per second
const REFILL_INTERVAL = 1000; // 1 second in milliseconds

class TokenBucket {
  constructor(capacity, fillRate) {
    this.capacity = capacity;
    this.fillRate = fillRate;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = Math.floor(timePassed * (this.fillRate / REFILL_INTERVAL));

    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  take() {
    this.refill();
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }

  getTokens() {
    this.refill();
    return Math.floor(this.tokens);
  }
}

function tokenBucketMiddleware(req, res, next) {
  const ip = req.ip;
  if (!buckets.has(ip)) {
    buckets.set(ip, new TokenBucket(BUCKET_CAPACITY, REFILL_RATE));
  }

  const bucket = buckets.get(ip);

  console.clear();
  console.log('Tokens: ', bucket.getTokens());

  if (bucket.take()) {
    next();
  } else {
    res.status(429).send(`Too many request, bitches🤮
      `);
  }
}

// Apply the token bucket rate limiting middleware to API calls
app.use('/api/rate-limit', tokenBucketMiddleware, (req, res) => {
  res.send(`PASSED
    `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
