import { NextRequest, NextResponse } from "next/server";
import type { NominatimAddress } from "@/lib/location";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");

  // Validate presence
  if (!latStr || !lonStr) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }

  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  // Validate numeric and in range
  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    const response = await fetch(nominatimUrl, {
      headers: {
        // Required by Nominatim Usage Policy: https://operations.osmfoundation.org/policies/nominatim/
        "User-Agent": "ZeroWasteFarm/1.0 (contact@zerowastefarm.co.za)",
      },
      // 8 second timeout
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Geocoding service unavailable" }, { status: 502 });
    }

    const data = await response.json();

    if (!data?.address) {
      return NextResponse.json({ error: "No address found for coordinates" }, { status: 404 });
    }

    // Return only the address fields — never expose full nominatim payload
    const address: NominatimAddress = {
      country_code: data.address.country_code,
      state: data.address.state,
      state_district: data.address.state_district,
      county: data.address.county,
      city: data.address.city,
      town: data.address.town,
      village: data.address.village,
      suburb: data.address.suburb,
    };

    return NextResponse.json(address);
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return NextResponse.json({ error: "Geocoding service timed out" }, { status: 504 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
