"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Download, CreditCard, DollarSign, Users, Activity } from "lucide-react"
import { StatsChart } from "@/common/dashboard/stats-chart"
import { SubscriptionsChart } from "@/common/dashboard/subscriptions-chart"

export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-4 p-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Tableau de Bord</h2>
                <div className="flex items-center space-x-2">
                    <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                    </Button>
                    <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Choisir une date
                    </Button>
                </div>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
                    <TabsTrigger value="analytics" disabled>Analytique</TabsTrigger>
                    <TabsTrigger value="reports" disabled>Rapports</TabsTrigger>
                    <TabsTrigger value="notifications" disabled>Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Ventes Totales
                                </CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+2350</div>
                                <p className="text-xs text-muted-foreground">
                                    +180.1% depuis le mois dernier
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Commandes (7j)
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+12,234</div>
                                <p className="text-xs text-muted-foreground">
                                    +19% depuis le mois dernier
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Panier Moyen
                                </CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">45.00 €</div>
                                <p className="text-xs text-muted-foreground">
                                    +201 depuis la dernière heure
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Chiffre d&apos;Affaires
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">573.00 €</div>
                                <p className="text-xs text-muted-foreground">
                                    +201 depuis la dernière heure
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Évolution des Ventes</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <StatsChart />
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Ventes par Catégorie</CardTitle>
                                <CardDescription>
                                    Répartition des ventes ce mois-ci
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SubscriptionsChart />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Dernières Ventes</CardTitle>
                                <CardDescription>
                                    Vous avez réalisé 265 ventes ce mois-ci.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Placeholder for Recent Sales Table */}
                                <div className="space-y-8">
                                    <div className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Olivia Martin</p>
                                            <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                                        </div>
                                        <div className="ml-auto font-medium">+1,999.00€</div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Jackson Lee</p>
                                            <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                                        </div>
                                        <div className="ml-auto font-medium">+39.00€</div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                                            <p className="text-sm text-muted-foreground">isabella.nguyen@email.com</p>
                                        </div>
                                        <div className="ml-auto font-medium">+299.00€</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Équipe</CardTitle>
                                <CardDescription>
                                    Invitez des membres de votre équipe.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Placeholder for Team Members */}
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between space-x-4">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <p className="text-sm font-medium leading-none">Sofia Davis</p>
                                                <p className="text-sm text-muted-foreground">m@example.com</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">Admin</Button>
                                    </div>
                                    <div className="flex items-center justify-between space-x-4">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <p className="text-sm font-medium leading-none">Jackson Lee</p>
                                                <p className="text-sm text-muted-foreground">p@example.com</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">Vendeur</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
