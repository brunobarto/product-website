"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavBar() {
  const pathname = usePathname();
  const linkClass = (href: string) =>
    "px-2" + (pathname === href ? " font-bold" : "");

  return (
    <nav className="mb-4 flex gap-4 text-xs font-mac">
      <Link href="/" className={linkClass("/")}>
        Home
      </Link>
      <Link href="/products" className={linkClass("/products")}>
        Products
      </Link>
      <Link href="/checkout" className={linkClass("/checkout")}>
        Checkout
      </Link>
      <Link href="/orders" className={linkClass("/orders")}>
        My Orders
      </Link>
      <Link href="/admin/customers" className={linkClass("/admin/customers")}>
        Admin Customers
      </Link>
      <Link href="/admin/sales" className={linkClass("/admin/sales")}>
        Admin Sales
      </Link>
    </nav>
  );
}
