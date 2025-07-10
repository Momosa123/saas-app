"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type NavigationItem = {
  label: string;
  href: string;
  roles?: ("student" | "teacher")[];
};

const NavItems = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const [userRole, setUserRole] = useState<"student" | "teacher" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Appeler notre API pour récupérer le rôle depuis Supabase
        const response = await fetch("/api/user/role");
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Erreur récupération rôle:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  // Configuration de la navigation selon les rôles
  const navigationItems: NavigationItem[] = [
    { label: "Accueil", href: "/" },
    { label: "AI Tutors", href: "/tutors", roles: ["student", "teacher"] },
    { label: "Mon Parcours", href: "/my-journey", roles: ["student"] },
    { label: "Mes Rapports", href: "/reports", roles: ["student"] },
    { label: "Dashboard", href: "/dashboard", roles: ["teacher"] },
    { label: "Mes Classes", href: "/dashboard", roles: ["teacher"] },
  ];

  // Filtrer les éléments selon le rôle
  const visibleItems = navigationItems.filter((item) => {
    if (!item.roles) return true; // Éléments visibles pour tous
    if (!userRole) return false; // Pas de rôle = pas d'accès
    return item.roles.includes(userRole);
  });

  // Éviter les doublons (Dashboard et Mes Classes pointent vers la même route)
  const uniqueItems = visibleItems.filter(
    (item, index, self) => index === self.findIndex((i) => i.href === item.href)
  );

  if (loading) {
    return (
      <nav className="flex items-center gap-4">
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-4">
      {uniqueItems.map(({ label, href }) => (
        <Link
          href={href}
          key={`${label}-${href}`}
          className={cn(
            "hover:text-primary transition-colors",
            pathname === href && "text-primary font-semibold"
          )}
        >
          {label}
        </Link>
      ))}

      {/* Badge de rôle discret */}
      {userRole && (
        <div className="ml-2 flex items-center">
          <span className="text-xs text-gray-500">
            {userRole === "teacher" ? "👨‍🏫" : "🎓"}
          </span>
        </div>
      )}
    </nav>
  );
};

export default NavItems;
