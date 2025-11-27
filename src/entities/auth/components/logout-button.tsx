"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function LogoutButton() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Déconnexion réussie")
                        router.push("/sign-in")
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || "Erreur lors de la déconnexion")
                    }
                }
            })
        } catch (error) {
            console.error("Logout error:", error)
            toast.error("Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
        >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? "Déconnexion..." : "Se déconnecter"}
        </Button>
    )
}
