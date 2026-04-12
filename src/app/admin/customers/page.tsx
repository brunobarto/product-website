import { prisma } from "@/lib/prisma";
import { MacWindow } from "@/components/MacWindow";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { orders: true }
  });

  return (
    <main>
      <MacWindow title="Customers">
        <table className="w-full text-[10px]">
          <thead>
            <tr>
              <th className="text-left">Email</th>
              <th className="text-left">Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.email}</td>
                <td>{c.orders.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </MacWindow>
    </main>
  );
}
