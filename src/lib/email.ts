import { Resend } from "resend";
import { Order, OrderItem, Product, User } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY!);

type FullOrder = Order & {
  user: User;
  items: (OrderItem & { product: Product })[];
};

export async function sendOrderReceiptEmail(order: FullOrder) {
  await resend.emails.send({
    from: "Vinyl Store <orders@vinylstore.com>",
    to: order.user.email,
    subject: `Your order #${order.id}`,
    html: `
      <h1>Thanks for your purchase!</h1>
      <p>Order ID: ${order.id}</p>
      <ul>
        ${order.items
          .map(
            (item) =>
              `<li>${item.quantity} × ${item.product.title} – €${(
                item.priceCents / 100
              ).toFixed(2)}</li>`
          )
          .join("")}
      </ul>
      <p>Total: €${(order.totalCents / 100).toFixed(2)}</p>
    `
  });
}
