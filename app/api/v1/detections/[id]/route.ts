import { NextRequest, NextResponse } from 'next/server';

// Sample whale detection data (should be shared with main detections route in production)
const detections: Record<string, any> = {
  "det_9k2j3h4k5l6m": {
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
  "det_8j1k2l3m4n5o": {
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
  "det_7i0j1k2l3m4n": {
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
};

// Helper function to verify Bearer token
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token.length > 0;
}

// GET /api/v1/detections/[id] - Get detailed information about a specific detection
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Find the detection
    const detection = detections[id];

    if (!detection) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: `Detection with id '${id}' not found`
        },
        { status: 404 }
      );
    }

    return NextResponse.json(detection);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch detection' },
      { status: 500 }
    );
  }
}
