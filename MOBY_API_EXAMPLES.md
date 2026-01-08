# Moby Labs API - Implementation Examples

All API endpoints from the documentation are now implemented and ready to use!

## Base URL
- **Local Development**: `http://localhost:3000`
- **Production** (after deployment): `https://your-domain.vercel.app`

## Authentication
All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_API_KEY
```

For testing, any non-empty token will work. In production, you would validate against real API keys stored in your database.

---

## 1. GET /api/v1/detections

Retrieve recent whale detections from the buoy network.

### Example Request

**cURL:**
```bash
curl -H "Authorization: Bearer test_key_123" \
  "http://localhost:3000/api/v1/detections"
```

**JavaScript:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/detections', {
  headers: {
    'Authorization': 'Bearer test_key_123'
  }
});
const data = await response.json();
console.log(data);
```

**Python:**
```python
import requests

headers = {'Authorization': 'Bearer test_key_123'}
response = requests.get('http://localhost:3000/api/v1/detections', headers=headers)
print(response.json())
```

### Query Parameters

- `limit` (integer, optional) - Number of results (default: 50, max: 500)
- `buoy_id` (string, optional) - Filter by specific buoy ID
- `species` (string, optional) - Filter by species (humpback, blue, gray)
- `since` (timestamp, optional) - Get detections since this timestamp (ISO 8601)

### Example with Filters

```bash
# Get last 10 humpback detections from specific buoy
curl -H "Authorization: Bearer test_key_123" \
  "http://localhost:3000/api/v1/detections?limit=10&species=humpback&buoy_id=buoy_001_sf_bay"

# Get detections since a specific time
curl -H "Authorization: Bearer test_key_123" \
  "http://localhost:3000/api/v1/detections?since=2025-12-28T12:00:00Z"
```

### Response
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

---

## 2. GET /api/v1/detections/{id}

Get detailed information about a specific detection.

### Example Request

```bash
curl -H "Authorization: Bearer test_key_123" \
  "http://localhost:3000/api/v1/detections/det_9k2j3h4k5l6m"
```

**JavaScript:**
```javascript
const detectionId = 'det_9k2j3h4k5l6m';
const response = await fetch(`http://localhost:3000/api/v1/detections/${detectionId}`, {
  headers: {
    'Authorization': 'Bearer test_key_123'
  }
});
const data = await response.json();
console.log(data);
```

### Available Detection IDs (for testing)
- `det_9k2j3h4k5l6m` - Humpback whale
- `det_8j1k2l3m4n5o` - Blue whale
- `det_7i0j1k2l3m4n` - Gray whale

### Response
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
    "ambient_noise_level": 42.1
  }
}
```

---

## 3. GET /api/v1/buoys

List all buoys in the network.

### Example Request

```bash
curl -H "Authorization: Bearer test_key_123" \
  "http://localhost:3000/api/v1/buoys"
```

**JavaScript:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/buoys', {
  headers: {
    'Authorization': 'Bearer test_key_123'
  }
});
const data = await response.json();
console.log(data);
```

### Query Parameters

- `status` (string, optional) - Filter by status: 'active', 'maintenance', 'offline'

### Example with Filter

```bash
# Get only active buoys
curl -H "Authorization: Bearer test_key_123" \
  "http://localhost:3000/api/v1/buoys?status=active"
```

### Response
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
      "uptime_percent": 99.2
    },
    {
      "id": "buoy_002_sf_bay",
      "name": "San Francisco Bay - South",
      "status": "active",
      "location": {
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "last_detection": "2025-12-28T13:15:42Z",
      "battery_level": 92,
      "uptime_percent": 98.8
    }
  ],
  "count": 2
}
```

---

## 4. POST /api/v1/alerts

Create a custom alert for whale detections in a specific area.

### Example Request

```bash
curl -X POST http://localhost:3000/api/v1/alerts \
  -H "Authorization: Bearer test_key_123" \
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
    "webhook_url": "https://your-app.com/webhook/whale-alert"
  }'
```

**JavaScript:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/alerts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer test_key_123',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Shipping Lane Monitor",
    area: {
      north: 38.0,
      south: 37.0,
      east: -122.0,
      west: -123.0
    },
    species: ["humpback", "blue"],
    webhook_url: "https://your-app.com/webhook/whale-alert"
  })
});
const data = await response.json();
console.log(data);
```

**Python:**
```python
import requests

headers = {
    'Authorization': 'Bearer test_key_123',
    'Content-Type': 'application/json'
}

data = {
    "name": "Shipping Lane Monitor",
    "area": {
        "north": 38.0,
        "south": 37.0,
        "east": -122.0,
        "west": -123.0
    },
    "species": ["humpback", "blue"],
    "webhook_url": "https://your-app.com/webhook/whale-alert"
}

response = requests.post(
    'http://localhost:3000/api/v1/alerts',
    headers=headers,
    json=data
)
print(response.json())
```

### Request Body

- `name` (string, required) - Alert name
- `area` (object, required) - Geographic bounds with `north`, `south`, `east`, `west`
- `species` (array, optional) - List of species to alert on (empty = all species)
- `webhook_url` (string, required) - HTTPS URL to receive webhook notifications

### Response
```json
{
  "id": "alert_xyz789abc",
  "name": "Shipping Lane Monitor",
  "status": "active",
  "created_at": "2025-12-28T14:32:15Z"
}
```

---

## 5. GET /api/v1/alerts (Bonus Endpoint)

List all your alerts.

```bash
curl -H "Authorization: Bearer test_key_123" \
  "http://localhost:3000/api/v1/alerts"
```

---

## Testing All Endpoints

Run your dev server:
```bash
npm run dev
```

Then test in your browser (for GET endpoints):
- http://localhost:3000/api/v1/detections
- http://localhost:3000/api/v1/detections/det_9k2j3h4k5l6m
- http://localhost:3000/api/v1/buoys
- http://localhost:3000/api/v1/buoys?status=active

**Note:** Browser requests won't include Authorization headers, so add the header using browser dev tools or use cURL/Postman.

---

## Error Responses

### 401 Unauthorized
Missing or invalid Bearer token:
```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid Bearer token. Include your API key in the Authorization header."
}
```

### 400 Bad Request
Invalid parameters:
```json
{
  "error": "Bad Request",
  "message": "Field 'name' is required and must be a string"
}
```

### 404 Not Found
Resource not found:
```json
{
  "error": "Not Found",
  "message": "Detection with id 'invalid_id' not found"
}
```

---

## Next Steps

1. **Connect to Supabase**: Replace sample data with real database queries
2. **Implement Real Authentication**: Validate API keys against your database
3. **Add Rate Limiting**: Use middleware or Upstash Redis
4. **Deploy to Vercel**: Push to production and get your live API URL
5. **Set Up Webhooks**: Implement webhook delivery for alerts
6. **Add Monitoring**: Track API usage, errors, and performance

## Production Deployment

After deploying to Vercel, your API will be available at:
- `https://your-domain.vercel.app/api/v1/detections`
- `https://your-domain.vercel.app/api/v1/buoys`
- `https://your-domain.vercel.app/api/v1/alerts`

These endpoints will be accessible from anywhere on the internet!
