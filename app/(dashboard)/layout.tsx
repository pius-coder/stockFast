import type { Metadata } from "next"
import { Sidebar } from "@/common/sidebar"
import { Button } from "@/components/ui/button"
import { Search, Sun, Moon, PanelLeft } from "lucide-react"

export const metadata: Metadata = {
    title: "Dashboard - stockFast",
    description: "Tableau de bord de gestion de stock",
}

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="border-grid flex flex-1 flex-col min-h-screen">
            <div className="flex flex-1">
                <Sidebar />
                <div id="content" className="flex h-full w-full flex-col">
                    <header className="bg-background z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0">
                        <Button variant="ghost" size="icon" className="-ml-1 md:hidden">
                            <PanelLeft className="h-4 w-4" />
                            <span className="sr-only">Toggle Sidebar</span>
                        </Button>
                        <div className="bg-border shrink-0 w-[1px] mr-2 h-4 md:hidden"></div>
                        <div className="flex w-full justify-between items-center">
                            <div className="relative w-full max-w-sm hidden md:block">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    placeholder="Rechercher..."
                                    className="flex h-9 w-full rounded-md border border-input bg-muted/25 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
                                />
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}   
