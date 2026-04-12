import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderReceiptEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = formData.get("email") as string | null;
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  // Ensure user exists
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email, role: "CUSTOMER" }
    });
  }

  // Demo: pick first product as purchased item
  const product = await prisma.product.findFirst();
  if (!product) {
    return NextResponse.json(
      { error: "No products in catalog" },
      { status: 400 }
    );
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalCents: product.priceCents,
      items: {
        create: [
          {
            productId: product.id,
            quantity: 1,
            priceCents: product.priceCents
          }
        ]
      }
    },
    include: { items: { include: { product: true } }, user: true }
  });

  await sendOrderReceiptEmail(order);

  return NextResponse.redirect(new URL("/orders", req.url));
}
