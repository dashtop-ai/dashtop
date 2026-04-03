import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const pricing = searchParams.get("pricing");
  const sort = searchParams.get("sort") || "popular";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const where = {
    isPublished: true,
    ...(type && { type }),
    ...(category && { category }),
    ...(pricing && { pricingModel: pricing }),
    ...(query && {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
      ],
    }),
  };

  const orderBy =
    sort === "newest"
      ? { createdAt: "desc" as const }
      : sort === "top-rated"
        ? { avgRating: "desc" as const }
        : sort === "price-low"
          ? { price: "asc" as const }
          : { downloadCount: "desc" as const };

  const [listings, total] = await Promise.all([
    prisma.marketplaceListing.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        creator: { select: { name: true, username: true, image: true } },
      },
    }),
    prisma.marketplaceListing.count({ where }),
  ]);

  return NextResponse.json({
    listings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
