import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const VETERANS_API_URL = process.env.VETERANS_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const response = await fetch(`${VETERANS_API_URL}/veterans?limit=50`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch veterans' },
        { status: response.status }
      );
    }

    const veterans = await response.json();
    
    // Return simplified data for auto-fill dropdown
    const simplifiedVeterans = veterans.map((v: any) => ({
      id: v.id,
      display_name: `${v.first_name} ${v.last_name} (${v.branch_of_service})`,
      first_name: v.first_name,
      last_name: v.last_name,
      date_of_birth: v.date_of_birth,
      status: v.status,
      branch_of_service: v.branch_of_service,
      discharge_date: v.discharge_date,
    }));

    return NextResponse.json(simplifiedVeterans);
  } catch (error: any) {
    console.error('Failed to fetch veterans:', error);
    return NextResponse.json(
      { error: 'Veterans API unavailable' },
      { status: 503 }
    );
  }
}
