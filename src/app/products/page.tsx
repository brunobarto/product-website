import { prisma } from "@/lib/prisma";
import { MacWindow } from "@/components/MacWindow";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await prisma.product.findMany();

  return (
    <main>
      <MacWindow title="All Records">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`}>
              <div className="space-y-1">
                <div className="aspect-square bg-black/10" />
                <div className="font-bold">{p.title}</div>
                <div>{p.artist}</div>
                <div>€{(p.priceCents / 100).toFixed(2)}</div>
              </div>
            </Link>
          ))}
        </div>
      </MacWindow>
    </main>
  );
}

