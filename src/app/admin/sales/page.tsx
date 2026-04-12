import { prisma } from "@/lib/prisma";
import { MacWindow } from "@/components/MacWindow";

export default async function AdminSalesPage() {
  const orders = await prisma.order.findMany();
  const totalRevenue = orders.reduce((s, o) => s + o.totalCents, 0);

  return (
    <main>
      <MacWindow title="Sales">
        <div className="space-y-2">
          <div>Total orders: {orders.length}</div>
          <div>Total revenue: €{(totalRevenue / 100).toFixed(2)}</div>
        </div>
      </MacWindow>
    </main>
  );
}
