import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Helper to get start of day and next day
function getDayRange(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { start, end };
}

export async function GET() {
    const days = 30;
    const today = new Date();
    const dailyData: { date: string; products: number; sales: number; alerts: number; revenue: number }[] = [];

    // Daily Stats
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const { start, end } = getDayRange(d);

        const [productCount, saleCount, alertCount, revenueAgg] = await Promise.all([
            prisma.product.count({ where: { createdAt: { gte: start, lt: end } } }),
            prisma.sale.count({ where: { soldAt: { gte: start, lt: end } } }),
            prisma.stockAlert.count({ where: { createdAt: { gte: start, lt: end } } }),
            prisma.sale.aggregate({
                where: { soldAt: { gte: start, lt: end } },
                _sum: { totalAmount: true }
            })
        ]);

        dailyData.push({
            date: start.toISOString().split("T")[0],
            products: productCount,
            sales: saleCount,
            alerts: alertCount,
            revenue: Number(revenueAgg._sum.totalAmount || 0)
        });
    }

    // Category Stats (Last 30 days)
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesByCategory = await prisma.sale.findMany({
        where: { soldAt: { gte: thirtyDaysAgo } },
        include: { product: true }
    });

    const categoryMap: Record<string, number> = {};
    salesByCategory.forEach(sale => {
        const category = sale.product.category;
        categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    return NextResponse.json({
        daily: dailyData,
        categories: categoryData
    });
}
