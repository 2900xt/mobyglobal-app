import { NextRequest, NextResponse } from 'next/server';

// Sample quotes data
const quotes = [
  {
    id: 'QT-2026-001',
    status: 'pending',
    origin: {
      port: 'Shanghai',
      country: 'China',
    },
    destination: {
      port: 'Los Angeles',
      country: 'USA',
    },
    cargo: {
      type: '40ft Container',
      weight: 25000,
      commodity: 'Electronics',
    },
    pricing: {
      oceanFreight: 2500,
      portCharges: 350,
      documentation: 150,
      total: 3000,
      currency: 'USD',
    },
    transitTime: '14-18 days',
    validUntil: '2026-02-01T23:59:59Z',
    createdAt: '2026-01-05T10:00:00Z',
  },
];

// GET /api/quotes - Get all quotes or specific quote by ID
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const status = searchParams.get('status');

    let filteredQuotes = quotes;

    // Filter by ID
    if (id) {
      filteredQuotes = filteredQuotes.filter(q => q.id === id);
      if (filteredQuotes.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Quote not found' },
          { status: 404 }
        );
      }
    }

    // Filter by status
    if (status) {
      filteredQuotes = filteredQuotes.filter(
        q => q.status.toLowerCase() === status.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      count: filteredQuotes.length,
      data: filteredQuotes,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}

// POST /api/quotes - Request a new quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.origin || !body.destination || !body.cargo) {
      return NextResponse.json(
        {
          success: false,
          error: 'origin, destination, and cargo details are required',
        },
        { status: 400 }
      );
    }

    // Calculate pricing based on cargo details (simplified logic)
    const baseRate = 2000;
    const weightMultiplier = (body.cargo.weight || 20000) / 20000;
    const oceanFreight = Math.round(baseRate * weightMultiplier);
    const portCharges = 350;
    const documentation = 150;
    const total = oceanFreight + portCharges + documentation;

    // Generate quote ID
    const quoteId = `QT-${new Date().getFullYear()}-${String(quotes.length + 1).padStart(3, '0')}`;

    // In production, you would:
    // 1. Validate authentication (optional for quote requests)
    // 2. Calculate real pricing based on routes, carriers, etc.
    // 3. Save to Supabase database
    // 4. Send notification email via Resend
    // 5. Return the quote

    const newQuote = {
      id: quoteId,
      status: 'pending',
      origin: body.origin,
      destination: body.destination,
      cargo: body.cargo,
      pricing: {
        oceanFreight,
        portCharges,
        documentation,
        total,
        currency: 'USD',
      },
      transitTime: '14-18 days',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      createdAt: new Date().toISOString(),
      contactInfo: body.contactInfo || null,
    };

    return NextResponse.json({
      success: true,
      message: 'Quote request received. We will contact you shortly.',
      data: newQuote,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create quote' },
      { status: 500 }
    );
  }
}

// PATCH /api/quotes - Update quote status (accept/reject)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'id and status are required' },
        { status: 400 }
      );
    }

    if (!['pending', 'accepted', 'rejected', 'expired'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Validate authentication
    // 2. Update in Supabase database
    // 3. Send notification email
    // 4. Return updated quote

    return NextResponse.json({
      success: true,
      message: `Quote ${id} updated to ${status}`,
      data: {
        id,
        status,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update quote' },
      { status: 500 }
    );
  }
}
