"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    BarChart3,
    Box,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Package,
    Settings,
    ShoppingCart,
    Users
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    const routes = [
        {
            label: "Vue d'ensemble",
            icon: LayoutDashboard,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            label: "Produits",
            icon: Package,
            href: "/products",
            active: pathname.startsWith("/products"),
        },
        {
            label: "Ventes",
            icon: ShoppingCart,
            href: "/sales",
            active: pathname.startsWith("/sales"),
        },
        {
            label: "Stock",
            icon: Box,
            href: "/stock",
            active: pathname.startsWith("/stock"),
        },
        {
            label: "Clients",
            icon: Users,
            href: "/customers",
            active: pathname.startsWith("/customers"),
        },
        {
            label: "Rapports",
            icon: BarChart3,
            href: "/reports",
            active: pathname.startsWith("/reports"),
        },
        {
            label: "Paramètres",
            icon: Settings,
            href: "/settings",
            active: pathname.startsWith("/settings"),
        },
    ]

    return (
        <div className={cn(
            "pb-12 border-r min-h-[calc(100vh-4rem)] transition-all duration-300 relative bg-card",
            isCollapsed ? "w-16" : "w-64",
            className
        )}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className={cn("flex items-center mb-2 px-4", isCollapsed ? "justify-center px-0" : "justify-between")}>
                        {!isCollapsed && (
                            <h2 className="text-lg font-semibold tracking-tight whitespace-nowrap overflow-hidden">
                                Menu
                            </h2>
                        )}
                    </div>

                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                                    route.active
                                        ? "bg-accent text-accent-foreground"
                                        : "transparent",
                                    isCollapsed ? "justify-center px-2" : ""
                                )}
                                title={isCollapsed ? route.label : undefined}
                            >
                                <route.icon className={cn("h-4 w-4 flex-shrink-0", isCollapsed ? "mr-0" : "mr-2")} />
                                {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{route.label}</span>}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <Button
                variant="link"
                size="icon"
                className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border bg-background shadow-md z-50 hover:bg-accent"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                ) : (
                    <ChevronLeft className="h-3 w-3" />
                )}
            </Button>
        </div>
    )
}
