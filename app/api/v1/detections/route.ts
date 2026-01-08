import { NextRequest, NextResponse } from 'next/server';

// Sample whale detection data
const detections = [
  {
    id: "det_9k2j3h4k5l6m",
    buoy_id: "buoy_001_sf_bay",
    timestamp: "2025-12-28T14:32:15Z",
    species: "humpback",
    confidence: 0.9784,
    location: {
      latitude: 37.8199,
      longitude: -122.4783,
    },
    acoustic_signature: "https://cdn.mobylabs.com/signatures/det_9k2j3h4k5l6m.wav",
    metadata: {
      water_temperature: 14.2,
      depth: 85.5,
      ambient_noise_level: 42.1,
    },
  },
  {
    id: "det_8j1k2l3m4n5o",
    buoy_id: "buoy_002_sf_bay",
    timestamp: "2025-12-28T13:15:42Z",
    species: "blue",
    confidence: 0.9512,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    acoustic_signature: "https://cdn.mobylabs.com/signatures/det_8j1k2l3m4n5o.wav",
    metadata: {
      water_temperature: 13.8,
      depth: 92.3,
      ambient_noise_level: 38.7,
    },
  },
  {
    id: "det_7i0j1k2l3m4n",
    buoy_id: "buoy_001_sf_bay",
    timestamp: "2025-12-28T12:45:30Z",
    species: "gray",
    confidence: 0.8923,
    location: {
      latitude: 37.8199,
      longitude: -122.4783,
    },
    acoustic_signature: "https://cdn.mobylabs.com/signatures/det_7i0j1k2l3m4n.wav",
    metadata: {
      water_temperature: 14.1,
      depth: 83.2,
      ambient_noise_level: 41.5,
    },
  },
  {
    id: "det_6h9i0j1k2l3m",
    buoy_id: "buoy_003_monterey",
    timestamp: "2025-12-28T11:22:18Z",
    species: "humpback",
    confidence: 0.9645,
    location: {
      latitude: 36.6002,
      longitude: -121.8947,
    },
    acoustic_signature: "https://cdn.mobylabs.com/signatures/det_6h9i0j1k2l3m.wav",
    metadata: {
      water_temperature: 12.5,
      depth: 105.8,
      ambient_noise_level: 35.2,
    },
  },
  {
    id: "det_5g8h9i0j1k2l",
    buoy_id: "buoy_002_sf_bay",
    timestamp: "2025-12-28T10:05:55Z",
    species: "blue",
    confidence: 0.9801,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    acoustic_signature: "https://cdn.mobylabs.com/signatures/det_5g8h9i0j1k2l.wav",
    metadata: {
      water_temperature: 13.9,
      depth: 88.7,
      ambient_noise_level: 39.3,
    },
  },
];

// Helper function to verify Bearer token
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  // In production, you would verify the actual token here
  // For now, we just check that a token is provided
  const token = authHeader.substring(7);
  return token.length > 0;
}

// GET /api/v1/detections - Retrieve recent whale detections
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
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 500);
    const buoy_id = searchParams.get('buoy_id');
    const species = searchParams.get('species');
    const since = searchParams.get('since');

    let filteredDetections = [...detections];

    // Filter by buoy_id
    if (buoy_id) {
      filteredDetections = filteredDetections.filter(d => d.buoy_id === buoy_id);
    }

    // Filter by species
    if (species) {
      filteredDetections = filteredDetections.filter(
        d => d.species.toLowerCase() === species.toLowerCase()
      );
    }

    // Filter by timestamp (since)
    if (since) {
      const sinceDate = new Date(since);
      filteredDetections = filteredDetections.filter(
        d => new Date(d.timestamp) >= sinceDate
      );
    }

    // Sort by timestamp (most recent first)
    filteredDetections.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply limit
    const paginatedDetections = filteredDetections.slice(0, limit);

    // Generate next cursor (for pagination)
    const next_cursor = paginatedDetections.length === limit && filteredDetections.length > limit
      ? Buffer.from(JSON.stringify({ id: paginatedDetections[paginatedDetections.length - 1].id })).toString('base64')
      : null;

    return NextResponse.json({
      detections: paginatedDetections,
      count: paginatedDetections.length,
      next_cursor,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch detections' },
      { status: 500 }
    );
  }
}
