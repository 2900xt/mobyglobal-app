# MobyGlobal API Examples

These are sample API endpoints for the MobyGlobal shipping platform. Once deployed, these can be accessed from anywhere.

## Base URL
- **Local Development**: `http://localhost:3000`
- **Production** (after deployment): `https://your-domain.vercel.app`

---

## 1. Vessels API

### Get All Vessels
```bash
curl http://localhost:3000/api/vessels
```

**JavaScript:**
```javascript
const response = await fetch('http://localhost:3000/api/vessels');
const data = await response.json();
console.log(data);
```

### Get Vessel by ID
```bash
curl http://localhost:3000/api/vessels?id=1
```

### Get Vessel by IMO Number
```bash
curl http://localhost:3000/api/vessels?imo=9876543
```

### Filter by Status
```bash
curl http://localhost:3000/api/vessels?status=In%20Transit
```

### Create New Vessel (POST)
```bash
curl -X POST http://localhost:3000/api/vessels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MV Atlantic Explorer",
    "imo": "9876545",
    "mmsi": "123456791",
    "type": "Tanker",
    "flag": "Marshall Islands"
  }'
```

**JavaScript:**
```javascript
const response = await fetch('http://localhost:3000/api/vessels', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: "MV Atlantic Explorer",
    imo: "9876545",
    mmsi: "123456791",
    type: "Tanker",
    flag: "Marshall Islands"
  })
});
const data = await response.json();
console.log(data);
```

---

## 2. Tracking API

### Track a Shipment
```bash
curl http://localhost:3000/api/tracking?number=MOBY123456789
```

**JavaScript:**
```javascript
const response = await fetch('http://localhost:3000/api/tracking?number=MOBY123456789');
const data = await response.json();
console.log(data);
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "trackingNumber": "MOBY123456789",
    "status": "In Transit",
    "origin": {
      "port": "Shanghai",
      "country": "China",
      "departure": "2026-01-01T10:00:00Z"
    },
    "destination": {
      "port": "Los Angeles",
      "country": "USA",
      "estimatedArrival": "2026-01-15T08:00:00Z"
    },
    "vessel": {
      "name": "MV Ocean Navigator",
      "imo": "9876543"
    },
    "milestones": [...]
  }
}
```

### Available Tracking Numbers (for testing)
- `MOBY123456789` - In Transit
- `MOBY987654321` - Delivered

### Create Tracking Entry (POST)
```bash
curl -X POST http://localhost:3000/api/tracking \
  -H "Content-Type: application/json" \
  -d '{
    "trackingNumber": "MOBY111222333",
    "origin": {
      "port": "Singapore",
      "country": "Singapore"
    },
    "destination": {
      "port": "Hamburg",
      "country": "Germany"
    }
  }'
```

---

## 3. Quotes API

### Get All Quotes
```bash
curl http://localhost:3000/api/quotes
```

### Get Quote by ID
```bash
curl http://localhost:3000/api/quotes?id=QT-2026-001
```

### Filter by Status
```bash
curl http://localhost:3000/api/quotes?status=pending
```

### Request a Quote (POST)
```bash
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {
      "port": "Shanghai",
      "country": "China"
    },
    "destination": {
      "port": "New York",
      "country": "USA"
    },
    "cargo": {
      "type": "40ft Container",
      "weight": 25000,
      "commodity": "Textiles"
    },
    "contactInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    }
  }'
```

**JavaScript:**
```javascript
const response = await fetch('http://localhost:3000/api/quotes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    origin: {
      port: "Shanghai",
      country: "China"
    },
    destination: {
      port: "New York",
      country: "USA"
    },
    cargo: {
      type: "40ft Container",
      weight: 25000,
      commodity: "Textiles"
    },
    contactInfo: {
      name: "John Doe",
      email: "john@example.com"
    }
  })
});
const data = await response.json();
console.log(data);
```

### Update Quote Status (PATCH)
```bash
curl -X PATCH http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "id": "QT-2026-001",
    "status": "accepted"
  }'
```

**Valid Status Values:** `pending`, `accepted`, `rejected`, `expired`

---

## Testing Locally

1. Start your development server:
```bash
npm run dev
```

2. Test the APIs using any of the methods above, or open in browser:
   - http://localhost:3000/api/vessels
   - http://localhost:3000/api/tracking?number=MOBY123456789
   - http://localhost:3000/api/quotes

---

## Using from Your Frontend

In any React component in your Next.js app:

```typescript
'use client';
import { useEffect, useState } from 'react';

export default function TrackingPage() {
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    fetch('/api/tracking?number=MOBY123456789')
      .then(res => res.json())
      .then(data => setTracking(data.data));
  }, []);

  if (!tracking) return <div>Loading...</div>;

  return (
    <div>
      <h1>Tracking: {tracking.trackingNumber}</h1>
      <p>Status: {tracking.status}</p>
      {/* Display more tracking data */}
    </div>
  );
}
```

---

## Python Example

```python
import requests

# Get vessels
response = requests.get('http://localhost:3000/api/vessels')
vessels = response.json()
print(vessels)

# Track shipment
response = requests.get('http://localhost:3000/api/tracking?number=MOBY123456789')
tracking = response.json()
print(tracking)

# Request quote
quote_data = {
    "origin": {"port": "Shanghai", "country": "China"},
    "destination": {"port": "Rotterdam", "country": "Netherlands"},
    "cargo": {"type": "20ft Container", "weight": 15000, "commodity": "Furniture"}
}
response = requests.post('http://localhost:3000/api/quotes', json=quote_data)
quote = response.json()
print(quote)
```

---

## Next Steps

1. **Add Authentication**: Implement API key validation or JWT tokens
2. **Connect to Supabase**: Replace sample data with real database queries
3. **Add Rate Limiting**: Use middleware to prevent abuse
4. **Deploy**: Push to Vercel and your API will be live
5. **Documentation**: Add Swagger/OpenAPI documentation

## Production Deployment

Once deployed to Vercel, replace `http://localhost:3000` with your actual domain:
- `https://mobyglobal.vercel.app/api/vessels`
- `https://mobyglobal.vercel.app/api/tracking?number=MOBY123456789`
- `https://mobyglobal.vercel.app/api/quotes`

These endpoints will be accessible from anywhere on the internet!
