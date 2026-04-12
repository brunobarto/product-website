import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MacWindow } from "@/components/MacWindow";

export default async function MyOrdersPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/api/auth/signin");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } } }
      }
    }
  });

  return (
    <main>
      <MacWindow title="My Orders">
        {!user || user.orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {user.orders.map((o) => (
              <div key={o.id} className="border-t border-black pt-2">
                <div>Order ID: {o.id}</div>
                <div>Date: {o.createdAt.toDateString()}</div>
                <div>
                  Total: €{(o.totalCents / 100).toFixed(2)} – {o.status}
                </div>
                <ul className="list-disc ml-4 mt-1">
                  {o.items.map((i) => (
                    <li key={i.id}>
                      {i.quantity} × {i.product.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </MacWindow>
    </main>
  );
}
