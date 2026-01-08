import { NextRequest, NextResponse } from 'next/server';

// Sample tracking data
const trackingData: Record<string, any> = {
  'MOBY123456789': {
    trackingNumber: 'MOBY123456789',
    status: 'In Transit',
    origin: {
      port: 'Shanghai',
      country: 'China',
      departure: '2026-01-01T10:00:00Z',
    },
    destination: {
      port: 'Los Angeles',
      country: 'USA',
      estimatedArrival: '2026-01-15T08:00:00Z',
    },
    vessel: {
      name: 'MV Ocean Navigator',
      imo: '9876543',
    },
    container: {
      number: 'MSCU1234567',
      type: '40ft High Cube',
      sealNumber: 'SEAL123456',
    },
    milestones: [
      {
        timestamp: '2026-01-01T08:00:00Z',
        location: 'Shanghai Port',
        event: 'Container loaded',
        status: 'completed',
      },
      {
        timestamp: '2026-01-01T10:00:00Z',
        location: 'Shanghai Port',
        event: 'Vessel departed',
        status: 'completed',
      },
      {
        timestamp: '2026-01-08T14:30:00Z',
        location: 'Pacific Ocean (35.6°N, 139.6°E)',
        event: 'In transit',
        status: 'current',
      },
      {
        timestamp: null,
        location: 'Los Angeles Port',
        event: 'Expected arrival',
        status: 'pending',
      },
    ],
    lastUpdated: new Date().toISOString(),
  },
  'MOBY987654321': {
    trackingNumber: 'MOBY987654321',
    status: 'Delivered',
    origin: {
      port: 'Singapore',
      country: 'Singapore',
      departure: '2025-12-15T10:00:00Z',
    },
    destination: {
      port: 'Rotterdam',
      country: 'Netherlands',
      estimatedArrival: '2026-01-05T08:00:00Z',
    },
    vessel: {
      name: 'MV Pacific Trader',
      imo: '9876544',
    },
    container: {
      number: 'MSCU7654321',
      type: '20ft Standard',
      sealNumber: 'SEAL789012',
    },
    milestones: [
      {
        timestamp: '2025-12-15T08:00:00Z',
        location: 'Singapore Port',
        event: 'Container loaded',
        status: 'completed',
      },
      {
        timestamp: '2025-12-15T10:00:00Z',
        location: 'Singapore Port',
        event: 'Vessel departed',
        status: 'completed',
      },
      {
        timestamp: '2026-01-05T06:30:00Z',
        location: 'Rotterdam Port',
        event: 'Vessel arrived',
        status: 'completed',
      },
      {
        timestamp: '2026-01-05T14:00:00Z',
        location: 'Rotterdam Port',
        event: 'Container unloaded',
        status: 'completed',
      },
      {
        timestamp: '2026-01-06T10:00:00Z',
        location: 'Warehouse Rotterdam',
        event: 'Delivered',
        status: 'completed',
      },
    ],
    lastUpdated: '2026-01-06T10:00:00Z',
  },
};

// GET /api/tracking?number=MOBY123456789
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const trackingNumber = searchParams.get('number');

    if (!trackingNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tracking number is required. Use ?number=MOBY123456789',
        },
        { status: 400 }
      );
    }

    const tracking = trackingData[trackingNumber];

    if (!tracking) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tracking number not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tracking,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tracking data' },
      { status: 500 }
    );
  }
}

// POST /api/tracking - Create a new tracking entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.trackingNumber || !body.origin || !body.destination) {
      return NextResponse.json(
        {
          success: false,
          error: 'trackingNumber, origin, and destination are required',
        },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Validate authentication
    // 2. Generate a unique tracking number
    // 3. Save to Supabase database
    // 4. Return the created tracking entry

    const newTracking = {
      ...body,
      status: body.status || 'Pending',
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newTracking,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create tracking entry' },
      { status: 500 }
    );
  }
}
