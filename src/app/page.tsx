import { prisma } from "@/lib/prisma";
import { MacWindow } from "@/components/MacWindow";

export default async function HomePage() {
  const featured = await prisma.product.findMany({ take: 6 });

  return (
    <main>
      <MacWindow title="Vinyl Store">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {featured.map((p) => (
            <div key={p.id} className="space-y-1">
              <div className="aspect-square bg-black/10" />
              <div className="font-bold">{p.title}</div>
              <div>{p.artist}</div>
              <div>€{(p.priceCents / 100).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </MacWindow>
    </main>
  );
}
