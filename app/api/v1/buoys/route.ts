import { NextRequest, NextResponse } from 'next/server';

// Sample buoy data
const buoys = [
  {
    id: "buoy_001_sf_bay",
    name: "San Francisco Bay - North",
    status: "active",
    location: {
      latitude: 37.8199,
      longitude: -122.4783,
    },
    last_detection: "2025-12-28T14:32:15Z",
    battery_level: 87,
    uptime_percent: 99.2,
  },
  {
    id: "buoy_002_sf_bay",
    name: "San Francisco Bay - South",
    status: "active",
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    last_detection: "2025-12-28T13:15:42Z",
    battery_level: 92,
    uptime_percent: 98.8,
  },
  {
    id: "buoy_003_monterey",
    name: "Monterey Bay",
    status: "active",
    location: {
      latitude: 36.6002,
      longitude: -121.8947,
    },
    last_detection: "2025-12-28T11:22:18Z",
    battery_level: 78,
    uptime_percent: 97.5,
  },
  {
    id: "buoy_004_channel_islands",
    name: "Channel Islands",
    status: "maintenance",
    location: {
      latitude: 34.0195,
      longitude: -119.4107,
    },
    last_detection: "2025-12-27T18:45:33Z",
    battery_level: 45,
    uptime_percent: 95.3,
  },
  {
    id: "buoy_005_puget_sound",
    name: "Puget Sound",
    status: "active",
    location: {
      latitude: 47.6062,
      longitude: -122.3321,
    },
    last_detection: "2025-12-28T15:10:05Z",
    battery_level: 94,
    uptime_percent: 99.8,
  },
  {
    id: "buoy_006_san_diego",
    name: "San Diego Coast",
    status: "offline",
    location: {
      latitude: 32.7157,
      longitude: -117.1611,
    },
    last_detection: "2025-12-25T09:22:11Z",
    battery_level: 12,
    uptime_percent: 88.2,
  },
];

// Helper function to verify Bearer token
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token.length > 0;
}

// GET /api/v1/buoys - List all active buoys in your network
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    if (!verifyAuth(request)) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Missing or invalid Bearer token. Include your API key in the Authorization header.'
        },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let filteredBuoys = [...buoys];

    // Filter by status if provided
    if (status) {
      const validStatuses = ['active', 'maintenance', 'offline'];

      if (!validStatuses.includes(status.toLowerCase())) {
        return NextResponse.json(
          {
            error: 'Bad Request',
            message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
          },
          { status: 400 }
        );
      }

      filteredBuoys = filteredBuoys.filter(
        b => b.status.toLowerCase() === status.toLowerCase()
      );
    }

    return NextResponse.json({
      buoys: filteredBuoys,
      count: filteredBuoys.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch buoys' },
      { status: 500 }
    );
  }
}
