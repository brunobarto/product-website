import { MacWindow } from "@/components/MacWindow";
import { MacButton } from "@/components/MacButton";

export default function CheckoutPage() {
  return (
    <main>
      <MacWindow title="Checkout">
        <form method="POST" action="/api/checkout">
          <div className="space-y-2 mb-4">
            <div>
              <label className="block mb-1">Email</label>
              <input
                name="email"
                type="email"
                className="border border-black px-2 py-1 text-xs w-full"
                required
              />
            </div>
            <p className="text-[10px]">
              Demo: backend will create a fake order with a sample product.
            </p>
          </div>
          <MacButton type="submit">Place Order</MacButton>
        </form>
      </MacWindow>
    </main>
  );
}
