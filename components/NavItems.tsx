"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const baseNavItems = [
  { label: "Home", href: "/" },
  { label: "Companions", href: "/companions" },
  { label: "My Journey", href: "/my-journey" },
];

const NavItems = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est un professeur
    // Cette logique sera améliorée plus tard avec les server actions
    if (user?.publicMetadata?.role === "teacher") {
      setIsTeacher(true);
    }
  }, [user]);

  const navItems = [
    ...baseNavItems,
    ...(isTeacher ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <nav className="flex items-center gap-4">
      {navItems.map(({ label, href }) => (
        <Link
          href={href}
          key={label}
          className={cn(pathname === href && "text-primary font-semibold")}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default NavItems;
