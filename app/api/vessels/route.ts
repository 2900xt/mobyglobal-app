import { NextRequest, NextResponse } from 'next/server';

// Sample vessel data (in production, this would come from your database)
const vessels = [
  {
    id: 1,
    name: "MV Ocean Navigator",
    imo: "9876543",
    mmsi: "123456789",
    type: "Container Ship",
    flag: "Panama",
    position: {
      latitude: 35.6762,
      longitude: 139.6503,
      course: 180,
      speed: 15.5,
    },
    status: "In Transit",
    destination: "Port of Los Angeles",
    eta: "2026-01-15T08:00:00Z",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 2,
    name: "MV Pacific Trader",
    imo: "9876544",
    mmsi: "123456790",
    type: "Bulk Carrier",
    flag: "Liberia",
    position: {
      latitude: 1.3521,
      longitude: 103.8198,
      course: 270,
      speed: 12.3,
    },
    status: "At Port",
    destination: "Singapore",
    eta: null,
    lastUpdated: new Date().toISOString(),
  },
];

// GET /api/vessels - Get all vessels or filter by query params
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const imo = searchParams.get('imo');
    const status = searchParams.get('status');

    let filteredVessels = vessels;

    // Filter by ID
    if (id) {
      filteredVessels = filteredVessels.filter(v => v.id === parseInt(id));
    }

    // Filter by IMO number
    if (imo) {
      filteredVessels = filteredVessels.filter(v => v.imo === imo);
    }

    // Filter by status
    if (status) {
      filteredVessels = filteredVessels.filter(v =>
        v.status.toLowerCase() === status.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      count: filteredVessels.length,
      data: filteredVessels,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vessels' },
      { status: 500 }
    );
  }
}

// POST /api/vessels - Create a new vessel (requires authentication in production)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.imo) {
      return NextResponse.json(
        { success: false, error: 'Name and IMO are required' },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Validate the user is authenticated
    // 2. Save to Supabase database
    // 3. Return the created vessel

    const newVessel = {
      id: vessels.length + 1,
      ...body,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newVessel,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create vessel' },
      { status: 500 }
    );
  }
}
