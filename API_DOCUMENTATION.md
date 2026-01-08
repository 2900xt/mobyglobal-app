# Moby Labs API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [Rate Limits](#rate-limits)
5. [Endpoints](#endpoints)
   - [Detections](#detections)
   - [Buoys](#buoys)
   - [Alerts](#alerts)
6. [Response Format](#response-format)
7. [Error Handling](#error-handling)
8. [Code Examples](#code-examples)
9. [Webhooks](#webhooks)
10. [Best Practices](#best-practices)
11. [SDKs & Libraries](#sdks--libraries)
12. [Changelog](#changelog)

---

## Overview

The Moby Labs API provides programmatic access to real-time whale detection data from a global network of acoustic monitoring buoys. This REST API allows developers to:

- Access real-time whale detection data with confidence scores
- Monitor buoy network status and health
- Create custom geographic alerts for whale activity
- Retrieve acoustic signatures for research purposes

### Key Features

- **Real-time Data**: Access whale detections within seconds of occurrence
- **High Accuracy**: ML-powered detection with confidence scores >85%
- **Global Coverage**: Network of buoys across major whale migration routes
- **Flexible Filtering**: Filter by species, location, time, and more
- **Webhook Alerts**: Get notified instantly when whales are detected in your areas of interest

### API Versioning

Current Version: **v1**

Base URL: `https://api.mobylabs.com` (or `http://localhost:3000` for local development)

---

## Getting Started

### 1. Create an Account

Sign up at [mobylabs.com/signup](https://mobylabs.com/signup) to get started.

### 2. Generate API Key

After signing in:
1. Navigate to your [Account Settings](https://mobylabs.com/account)
2. Go to the "API Keys" section
3. Click "Generate New API Key"
4. Copy and securely store your key (it won't be shown again)

### 3. Make Your First Request

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.mobylabs.com/api/v1/detections?limit=5
```

### 4. Explore the Endpoints

See the [Endpoints](#endpoints) section below for detailed documentation of all available endpoints.

---

## Authentication

All API requests require authentication using Bearer tokens in the Authorization header.

### Header Format

```
Authorization: Bearer YOUR_API_KEY
```

### Example Request

```bash
curl -H "Authorization: Bearer ml_live_abc123xyz..." \
  https://api.mobylabs.com/api/v1/detections
```

### API Key Format

- **Test keys**: `ml_test_...` (limited data, no rate limits)
- **Live keys**: `ml_live_...` (full access, subject to rate limits)

### Security Best Practices

- Never commit API keys to version control
- Use environment variables to store keys
- Rotate keys regularly (every 90 days recommended)
- Use different keys for development and production
- Revoke compromised keys immediately via account settings

---

## Rate Limits

Rate limits are applied per API key.

### Tiers

| Tier | Requests/Hour | Requests/Day | Price |
|------|---------------|--------------|-------|
| **Free** | 100 | 1,000 | $0 |
| **Standard** | 1,000 | 10,000 | $49/mo |
| **Professional** | 10,000 | 100,000 | $199/mo |
| **Enterprise** | Custom | Custom | Contact Us |

### Rate Limit Headers

Every response includes rate limit information:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded

If you exceed your rate limit, you'll receive:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "Rate Limit Exceeded",
  "message": "You have exceeded your rate limit of 1000 requests per hour",
  "retry_after": 1847
}
```

---

## Endpoints

### Detections

#### GET /api/v1/detections

Retrieve recent whale detections from the buoy network.

**Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 50 | Number of results (max: 500) |
| `buoy_id` | string | No | - | Filter by specific buoy ID |
| `species` | string | No | - | Filter by species (humpback, blue, gray, fin, minke, right, sei, sperm) |
| `since` | timestamp | No | - | Get detections since this time (ISO 8601 format) |
| `cursor` | string | No | - | Pagination cursor from previous response |

**Response**

```json
{
  "detections": [
    {
      "id": "det_9k2j3h4k5l6m",
      "buoy_id": "buoy_001_sf_bay",
      "timestamp": "2025-12-28T14:32:15Z",
      "species": "humpback",
      "confidence": 0.9784,
      "location": {
        "latitude": 37.8199,
        "longitude": -122.4783
      },
      "acoustic_signature": "https://cdn.mobylabs.com/signatures/det_9k2j3h4k5l6m.wav",
      "metadata": {
        "water_temperature": 14.2,
        "depth": 85.5,
        "ambient_noise_level": 42.1
      }
    }
  ],
  "count": 1,
  "next_cursor": "eyJpZCI6ImRldF85azJqM2g0azVsNm0ifQ=="
}
```

**Field Descriptions**

- `id`: Unique detection identifier
- `buoy_id`: ID of the buoy that made the detection
- `timestamp`: Time of detection (UTC, ISO 8601)
- `species`: Whale species detected
- `confidence`: ML model confidence score (0-1)
- `location`: Geographic coordinates of the buoy
- `acoustic_signature`: URL to audio recording (WAV format, 30s clip)
- `metadata.water_temperature`: Temperature in Celsius
- `metadata.depth`: Water depth in meters
- `metadata.ambient_noise_level`: Background noise in dB

**Example Requests**

```bash
# Get last 10 detections
curl -H "Authorization: Bearer YOUR_KEY" \
  "https://api.mobylabs.com/api/v1/detections?limit=10"

# Get humpback detections from specific buoy
curl -H "Authorization: Bearer YOUR_KEY" \
  "https://api.mobylabs.com/api/v1/detections?species=humpback&buoy_id=buoy_001_sf_bay"

# Get detections in last hour
curl -H "Authorization: Bearer YOUR_KEY" \
  "https://api.mobylabs.com/api/v1/detections?since=2025-12-28T13:00:00Z"

# Pagination
curl -H "Authorization: Bearer YOUR_KEY" \
  "https://api.mobylabs.com/api/v1/detections?cursor=eyJpZCI6ImRldF85azJqM2g0azVsNm0ifQ=="
```

---

#### GET /api/v1/detections/{id}

Get detailed information about a specific detection.

**Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Detection ID (path parameter) |

**Response**

```json
{
  "id": "det_9k2j3h4k5l6m",
  "buoy_id": "buoy_001_sf_bay",
  "timestamp": "2025-12-28T14:32:15Z",
  "species": "humpback",
  "confidence": 0.9784,
  "location": {
    "latitude": 37.8199,
    "longitude": -122.4783
  },
  "acoustic_signature": "https://cdn.mobylabs.com/signatures/det_9k2j3h4k5l6m.wav",
  "metadata": {
    "water_temperature": 14.2,
    "depth": 85.5,
    "ambient_noise_level": 42.1,
    "signal_strength": 78.3,
    "frequency_range": "20-200 Hz",
    "duration": 12.5
  }
}
```

**Example Request**

```bash
curl -H "Authorization: Bearer YOUR_KEY" \
  "https://api.mobylabs.com/api/v1/detections/det_9k2j3h4k5l6m"
```

---

### Buoys

#### GET /api/v1/buoys

List all buoys in the network with their current status.

**Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status: `active`, `maintenance`, `offline` |

**Response**

```json
{
  "buoys": [
    {
      "id": "buoy_001_sf_bay",
      "name": "San Francisco Bay - North",
      "status": "active",
      "location": {
        "latitude": 37.8199,
        "longitude": -122.4783
      },
      "last_detection": "2025-12-28T14:32:15Z",
      "battery_level": 87,
      "uptime_percent": 99.2,
      "deployed_date": "2024-03-15T00:00:00Z",
      "maintenance_schedule": "2026-03-15T00:00:00Z"
    }
  ],
  "count": 1
}
```

**Field Descriptions**

- `id`: Unique buoy identifier
- `name`: Human-readable buoy name
- `status`: Current operational status
  - `active`: Fully operational
  - `maintenance`: Scheduled maintenance
  - `offline`: Not transmitting data
- `location`: Fixed geographic coordinates
- `last_detection`: Most recent whale detection timestamp
- `battery_level`: Battery percentage (0-100)
- `uptime_percent`: 30-day uptime percentage
- `deployed_date`: When the buoy was deployed
- `maintenance_schedule`: Next scheduled maintenance

**Example Requests**

```bash
# Get all buoys
curl -H "Authorization: Bearer YOUR_KEY" \
  "https://api.mobylabs.com/api/v1/buoys"

# Get only active buoys
curl -H "Authorization: Bearer YOUR_KEY" \
  "https://api.mobylabs.com/api/v1/buoys?status=active"

# Get buoys in maintenance
curl -H "Authorization: Bearer YOUR_KEY" \
  "https://api.mobylabs.com/api/v1/buoys?status=maintenance"
```

---

### Alerts

#### POST /api/v1/alerts

Create a custom alert to receive webhook notifications when whales are detected in a specific geographic area.

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Alert name (max 100 chars) |
| `area` | object | Yes | Geographic bounds |
| `area.north` | float | Yes | Northern latitude boundary |
| `area.south` | float | Yes | Southern latitude boundary |
| `area.east` | float | Yes | Eastern longitude boundary |
| `area.west` | float | Yes | Western longitude boundary |
| `species` | array | No | Species filter (empty = all species) |
| `webhook_url` | string | Yes | HTTPS URL for webhook delivery |
| `min_confidence` | float | No | Minimum confidence threshold (0-1, default: 0.85) |

**Response**

```json
{
  "id": "alert_xyz789abc",
  "name": "Shipping Lane Monitor",
  "status": "active",
  "created_at": "2025-12-28T14:32:15Z"
}
```

**Example Request**

```bash
curl -X POST https://api.mobylabs.com/api/v1/alerts \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shipping Lane Monitor",
    "area": {
      "north": 38.0,
      "south": 37.0,
      "east": -122.0,
      "west": -123.0
    },
    "species": ["humpback", "blue"],
    "webhook_url": "https://your-app.com/webhook/whale-alert",
    "min_confidence": 0.9
  }'
```

**Notes**

- Geographic area must be valid (north > south, appropriate longitude bounds)
- Webhook URL must be HTTPS (except localhost for testing)
- Maximum 50 active alerts per account
- Alert will remain active until manually deleted

---

#### GET /api/v1/alerts

List all your active alerts.

**Response**

```json
{
  "alerts": [
    {
      "id": "alert_xyz789abc",
      "name": "Shipping Lane Monitor",
      "status": "active",
      "area": {
        "north": 38.0,
        "south": 37.0,
        "east": -122.0,
        "west": -123.0
      },
      "species": ["humpback", "blue"],
      "webhook_url": "https://your-app.com/webhook/whale-alert",
      "min_confidence": 0.9,
      "created_at": "2025-12-28T14:32:15Z",
      "last_triggered": "2025-12-28T15:22:45Z",
      "trigger_count": 12
    }
  ],
  "count": 1
}
```

**Example Request**

```bash
curl -H "Authorization: Bearer YOUR_KEY" \
  "https://api.mobylabs.com/api/v1/alerts"
```

---

#### DELETE /api/v1/alerts/{id}

Delete an alert.

**Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Alert ID (path parameter) |

**Response**

```json
{
  "success": true,
  "message": "Alert deleted successfully"
}
```

**Example Request**

```bash
curl -X DELETE https://api.mobylabs.com/api/v1/alerts/alert_xyz789abc \
  -H "Authorization: Bearer YOUR_KEY"
```

---

## Response Format

All API responses follow a consistent JSON structure.

### Success Response

```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2025-12-28T14:32:15Z",
    "request_id": "req_abc123xyz"
  }
}
```

For list endpoints:

```json
{
  "items": [ ... ],
  "count": 10,
  "next_cursor": "...",
  "meta": {
    "timestamp": "2025-12-28T14:32:15Z",
    "request_id": "req_abc123xyz"
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created (for POST requests) |
| `400` | Bad Request (invalid parameters) |
| `401` | Unauthorized (missing/invalid API key) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found (resource doesn't exist) |
| `429` | Too Many Requests (rate limit exceeded) |
| `500` | Internal Server Error |
| `503` | Service Unavailable (maintenance) |

---

## Error Handling

### Error Response Format

All error responses follow this structure:

```json
{
  "error": "Error Type",
  "message": "Human-readable error description",
  "code": "ERROR_CODE",
  "details": { ... },
  "meta": {
    "timestamp": "2025-12-28T14:32:15Z",
    "request_id": "req_abc123xyz"
  }
}
```

### Common Errors

#### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid Bearer token. Include your API key in the Authorization header.",
  "code": "UNAUTHORIZED"
}
```

**Solution**: Include valid API key in Authorization header.

---

#### 400 Bad Request

```json
{
  "error": "Bad Request",
  "message": "Field 'name' is required and must be a string",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "name",
    "issue": "required"
  }
}
```

**Solution**: Check request parameters match documentation.

---

#### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Detection with id 'det_invalid' not found",
  "code": "NOT_FOUND"
}
```

**Solution**: Verify the resource ID exists.

---

#### 429 Rate Limit Exceeded

```json
{
  "error": "Rate Limit Exceeded",
  "message": "You have exceeded your rate limit of 1000 requests per hour",
  "code": "RATE_LIMIT_EXCEEDED",
  "retry_after": 1847
}
```

**Solution**: Wait `retry_after` seconds or upgrade your plan.

---

## Code Examples

### JavaScript / Node.js

```javascript
const MOBY_API_KEY = process.env.MOBY_API_KEY;
const BASE_URL = 'https://api.mobylabs.com';

// Get recent detections
async function getDetections(limit = 10) {
  const response = await fetch(`${BASE_URL}/api/v1/detections?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${MOBY_API_KEY}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API Error: ${error.message}`);
  }

  return await response.json();
}

// Get specific detection
async function getDetection(detectionId) {
  const response = await fetch(`${BASE_URL}/api/v1/detections/${detectionId}`, {
    headers: {
      'Authorization': `Bearer ${MOBY_API_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch detection: ${response.statusText}`);
  }

  return await response.json();
}

// Create alert
async function createAlert(alertData) {
  const response = await fetch(`${BASE_URL}/api/v1/alerts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MOBY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(alertData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create alert: ${error.message}`);
  }

  return await response.json();
}

// Usage
try {
  const detections = await getDetections(5);
  console.log(`Found ${detections.count} detections`);

  const alert = await createAlert({
    name: "My Alert",
    area: {
      north: 38.0,
      south: 37.0,
      east: -122.0,
      west: -123.0
    },
    species: ["humpback"],
    webhook_url: "https://myapp.com/webhook"
  });
  console.log(`Created alert: ${alert.id}`);
} catch (error) {
  console.error(error.message);
}
```

---

### Python

```python
import os
import requests
from typing import Dict, List, Optional

MOBY_API_KEY = os.getenv('MOBY_API_KEY')
BASE_URL = 'https://api.mobylabs.com'

class MobyLabsAPI:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

    def get_detections(
        self,
        limit: int = 50,
        buoy_id: Optional[str] = None,
        species: Optional[str] = None,
        since: Optional[str] = None
    ) -> Dict:
        """Get whale detections with optional filters"""
        params = {'limit': limit}
        if buoy_id:
            params['buoy_id'] = buoy_id
        if species:
            params['species'] = species
        if since:
            params['since'] = since

        response = requests.get(
            f'{BASE_URL}/api/v1/detections',
            headers=self.headers,
            params=params
        )
        response.raise_for_status()
        return response.json()

    def get_detection(self, detection_id: str) -> Dict:
        """Get a specific detection by ID"""
        response = requests.get(
            f'{BASE_URL}/api/v1/detections/{detection_id}',
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

    def get_buoys(self, status: Optional[str] = None) -> Dict:
        """Get all buoys, optionally filtered by status"""
        params = {'status': status} if status else {}
        response = requests.get(
            f'{BASE_URL}/api/v1/buoys',
            headers=self.headers,
            params=params
        )
        response.raise_for_status()
        return response.json()

    def create_alert(
        self,
        name: str,
        area: Dict,
        webhook_url: str,
        species: Optional[List[str]] = None,
        min_confidence: float = 0.85
    ) -> Dict:
        """Create a new whale detection alert"""
        data = {
            'name': name,
            'area': area,
            'webhook_url': webhook_url,
            'min_confidence': min_confidence
        }
        if species:
            data['species'] = species

        response = requests.post(
            f'{BASE_URL}/api/v1/alerts',
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()

    def get_alerts(self) -> Dict:
        """Get all active alerts"""
        response = requests.get(
            f'{BASE_URL}/api/v1/alerts',
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

# Usage
api = MobyLabsAPI(MOBY_API_KEY)

# Get recent humpback detections
detections = api.get_detections(limit=10, species='humpback')
print(f"Found {detections['count']} detections")

# Get all active buoys
buoys = api.get_buoys(status='active')
print(f"Active buoys: {buoys['count']}")

# Create an alert
alert = api.create_alert(
    name="Shipping Lane Monitor",
    area={
        "north": 38.0,
        "south": 37.0,
        "east": -122.0,
        "west": -123.0
    },
    species=["humpback", "blue"],
    webhook_url="https://myapp.com/webhook"
)
print(f"Created alert: {alert['id']}")
```

---

### cURL Examples

```bash
# Get detections
curl -H "Authorization: Bearer $MOBY_API_KEY" \
  "https://api.mobylabs.com/api/v1/detections?limit=10"

# Get specific detection
curl -H "Authorization: Bearer $MOBY_API_KEY" \
  "https://api.mobylabs.com/api/v1/detections/det_9k2j3h4k5l6m"

# Get buoys
curl -H "Authorization: Bearer $MOBY_API_KEY" \
  "https://api.mobylabs.com/api/v1/buoys?status=active"

# Create alert
curl -X POST https://api.mobylabs.com/api/v1/alerts \
  -H "Authorization: Bearer $MOBY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Alert",
    "area": {
      "north": 38.0,
      "south": 37.0,
      "east": -122.0,
      "west": -123.0
    },
    "webhook_url": "https://example.com/webhook"
  }'
```

---

## Webhooks

When you create an alert, we'll send HTTP POST requests to your webhook URL when matching detections occur.

### Webhook Payload

```json
{
  "event": "detection.created",
  "alert_id": "alert_xyz789abc",
  "detection": {
    "id": "det_9k2j3h4k5l6m",
    "buoy_id": "buoy_001_sf_bay",
    "timestamp": "2025-12-28T14:32:15Z",
    "species": "humpback",
    "confidence": 0.9784,
    "location": {
      "latitude": 37.8199,
      "longitude": -122.4783
    }
  },
  "delivered_at": "2025-12-28T14:32:16Z"
}
```

### Webhook Headers

```
Content-Type: application/json
X-Moby-Signature: sha256=abc123...
X-Moby-Event: detection.created
X-Moby-Alert-ID: alert_xyz789abc
```

### Verifying Webhook Signatures

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

// In your webhook endpoint
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-moby-signature'];
  const payload = JSON.stringify(req.body);

  if (!verifyWebhook(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook
  console.log('Whale detected:', req.body.detection);
  res.status(200).send('OK');
});
```

### Webhook Retry Policy

- Initial attempt: Immediate
- Retry 1: After 1 minute
- Retry 2: After 5 minutes
- Retry 3: After 30 minutes
- After 3 failed attempts, the webhook is disabled

Your endpoint must respond with HTTP 2xx within 10 seconds.

---

## Best Practices

### 1. API Key Management

```bash
# Store in environment variables
export MOBY_API_KEY="ml_live_abc123..."

# Never hardcode
❌ const API_KEY = "ml_live_abc123...";  # Bad!
✅ const API_KEY = process.env.MOBY_API_KEY;  # Good!
```

### 2. Error Handling

Always implement proper error handling:

```javascript
async function safeAPICall() {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error:', error.message);
      // Handle specific error codes
      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        // Wait and retry
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Network error:', error);
    // Implement retry logic
  }
}
```

### 3. Rate Limiting

Implement client-side rate limiting:

```javascript
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async throttle() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.requests.push(Date.now());
  }
}

const limiter = new RateLimiter(1000, 3600000); // 1000 req/hour

async function apiCall() {
  await limiter.throttle();
  return fetch(url, options);
}
```

### 4. Pagination

Always handle pagination for large datasets:

```javascript
async function getAllDetections() {
  let allDetections = [];
  let cursor = null;

  do {
    const params = new URLSearchParams({ limit: 500 });
    if (cursor) params.append('cursor', cursor);

    const response = await fetch(`${BASE_URL}/api/v1/detections?${params}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    const data = await response.json();
    allDetections = allDetections.concat(data.detections);
    cursor = data.next_cursor;
  } while (cursor);

  return allDetections;
}
```

### 5. Caching

Cache responses when appropriate:

```javascript
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute

async function getCachedBuoys() {
  const cacheKey = 'buoys';
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetchBuoys();
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}
```

---

## SDKs & Libraries

### Official SDKs

#### JavaScript / TypeScript
```bash
npm install @mobylabs/sdk
```

```typescript
import MobyLabs from '@mobylabs/sdk';

const moby = new MobyLabs({ apiKey: process.env.MOBY_API_KEY });

const detections = await moby.detections.list({ limit: 10 });
const buoys = await moby.buoys.list();
const alert = await moby.alerts.create({
  name: "My Alert",
  area: { north: 38, south: 37, east: -122, west: -123 },
  webhookUrl: "https://example.com/webhook"
});
```

#### Python
```bash
pip install mobylabs
```

```python
from mobylabs import MobyLabs

moby = MobyLabs(api_key=os.getenv('MOBY_API_KEY'))

detections = moby.detections.list(limit=10)
buoys = moby.buoys.list()
alert = moby.alerts.create(
    name="My Alert",
    area={"north": 38, "south": 37, "east": -122, "west": -123},
    webhook_url="https://example.com/webhook"
)
```

#### Go
```bash
go get github.com/mobylabs/moby-go
```

```go
import "github.com/mobylabs/moby-go"

client := moby.NewClient(os.Getenv("MOBY_API_KEY"))

detections, err := client.Detections.List(&moby.DetectionListParams{
    Limit: 10,
})

buoys, err := client.Buoys.List(nil)

alert, err := client.Alerts.Create(&moby.AlertCreateParams{
    Name: "My Alert",
    Area: moby.Area{North: 38, South: 37, East: -122, West: -123},
    WebhookURL: "https://example.com/webhook",
})
```

---

## Changelog

### v1.0.0 (2025-01-08)

**Initial Release**

- GET /api/v1/detections - List whale detections
- GET /api/v1/detections/{id} - Get specific detection
- GET /api/v1/buoys - List buoys
- POST /api/v1/alerts - Create alerts
- GET /api/v1/alerts - List alerts
- DELETE /api/v1/alerts/{id} - Delete alerts
- Webhook notifications
- Bearer token authentication
- Rate limiting

---

## Support

### Documentation
- Full docs: https://docs.mobylabs.com
- API Reference: https://api.mobylabs.com/docs

### Contact
- Email: api@mobylabs.com
- Discord: https://discord.gg/mobylabs
- GitHub: https://github.com/mobylabs

### Status
- API Status: https://status.mobylabs.com
- Incidents: Subscribe to status updates

---

**Happy Coding!** 🐋
