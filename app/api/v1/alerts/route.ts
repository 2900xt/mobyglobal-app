import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for alerts (in production, use database)
const alerts: any[] = [];

// Helper function to verify Bearer token
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token.length > 0;
}

// Generate alert ID
function generateAlertId(): string {
  const randomString = Math.random().toString(36).substring(2, 11);
  return `alert_${randomString}`;
}

// Validate webhook URL
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// POST /api/v1/alerts - Create a custom alert for whale detections in a specific area
export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Validate required fields
    const { name, area, webhook_url, species } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Field "name" is required and must be a string'
        },
        { status: 400 }
      );
    }

    if (!area || typeof area !== 'object') {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Field "area" is required and must be an object with geographic bounds'
        },
        { status: 400 }
      );
    }

    // Validate area has required lat/lng bounds
    if (!area.north || !area.south || !area.east || !area.west) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Field "area" must include north, south, east, and west bounds'
        },
        { status: 400 }
      );
    }

    if (!webhook_url || typeof webhook_url !== 'string') {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Field "webhook_url" is required and must be a valid URL'
        },
        { status: 400 }
      );
    }

    // Validate webhook URL format
    if (!isValidUrl(webhook_url)) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Field "webhook_url" must be a valid HTTP or HTTPS URL'
        },
        { status: 400 }
      );
    }

    // Validate species if provided
    if (species && !Array.isArray(species)) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Field "species" must be an array of species names'
        },
        { status: 400 }
      );
    }

    // Create the alert
    const newAlert = {
      id: generateAlertId(),
      name,
      area,
      species: species || [],
      webhook_url,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    // Store the alert (in production, save to database)
    alerts.push(newAlert);

    // Return success response
    return NextResponse.json(
      {
        id: newAlert.id,
        name: newAlert.name,
        status: newAlert.status,
        created_at: newAlert.created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

// GET /api/v1/alerts - List all alerts (bonus endpoint)
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

    return NextResponse.json({
      alerts,
      count: alerts.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}
