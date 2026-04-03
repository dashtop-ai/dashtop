import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Wallet,
  CreditCard,
} from "lucide-react";

// Mock earnings data
const transactions = [
  {
    id: "txn_1",
    listing: "Weather Dashboard Pro",
    buyer: "Alex Chen",
    amount: 4.99,
    tip: 0,
    date: "Apr 3, 2026",
    status: "completed",
  },
  {
    id: "txn_2",
    listing: "AI Chat Companion",
    buyer: "Sarah Kim",
    amount: 0,
    tip: 5.0,
    date: "Apr 3, 2026",
    status: "completed",
  },
  {
    id: "txn_3",
    listing: "Stock Ticker Widget",
    buyer: "Mike Johnson",
    amount: 2.99,
    tip: 1.0,
    date: "Apr 2, 2026",
    status: "completed",
  },
  {
    id: "txn_4",
    listing: "Weather Dashboard Pro",
    buyer: "Emma Wilson",
    amount: 4.99,
    tip: 0,
    date: "Apr 2, 2026",
    status: "completed",
  },
  {
    id: "txn_5",
    listing: "Task Manager Pro",
    buyer: "James Lee",
    amount: 1.99,
    tip: 2.0,
    date: "Apr 1, 2026",
    status: "completed",
  },
  {
    id: "txn_6",
    listing: "Productivity Dashboard",
    buyer: "Lisa Nguyen",
    amount: 0,
    tip: 3.0,
    date: "Apr 1, 2026",
    status: "completed",
  },
  {
    id: "txn_7",
    listing: "Weather Dashboard Pro",
    buyer: "Tom Richards",
    amount: 4.99,
    tip: 0,
    date: "Mar 31, 2026",
    status: "completed",
  },
  {
    id: "txn_8",
    listing: "AI Chat Companion",
    buyer: "David Park",
    amount: 0,
    tip: 10.0,
    date: "Mar 30, 2026",
    status: "pending",
  },
  {
    id: "txn_9",
    listing: "Stock Ticker Widget",
    buyer: "Rachel Green",
    amount: 2.99,
    tip: 0,
    date: "Mar 29, 2026",
    status: "completed",
  },
  {
    id: "txn_10",
    listing: "Weather Dashboard Pro",
    buyer: "Chris Taylor",
    amount: 4.99,
    tip: 1.0,
    date: "Mar 28, 2026",
    status: "completed",
  },
];

export default function EarningsPage() {
  const totalEarnings = transactions.reduce(
    (sum, t) => sum + t.amount + t.tip,
    0
  );
  const pendingPayouts = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount + t.tip, 0);
  const totalTips = transactions.reduce((sum, t) => sum + t.tip, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Earnings</h1>
          <p className="text-muted-foreground">
            Track revenue, tips, and payouts.
          </p>
        </div>
        <Button>
          <Wallet className="mr-2 h-4 w-4" />
          Request Payout
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Total Earnings
            </CardDescription>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalEarnings.toFixed(2)}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-500 mt-1">
              <ArrowUpRight className="h-3 w-3" />
              +22% this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Pending Payout
            </CardDescription>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${pendingPayouts.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Processing in 3-5 days
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Tips Received
            </CardDescription>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalTips.toFixed(2)}</div>
            <div className="flex items-center gap-1 text-xs text-emerald-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              +35% this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Lifetime Revenue
            </CardDescription>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,240.00</div>
            <div className="text-xs text-muted-foreground mt-1">
              Since Jan 2026
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction history */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent purchases and tips</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Listing
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
                    Tip
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-muted-foreground">
                        {txn.id}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{txn.listing}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {txn.buyer}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      {txn.amount > 0 ? `$${txn.amount.toFixed(2)}` : "--"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {txn.tip > 0 ? (
                        <span className="text-emerald-500">
                          +${txn.tip.toFixed(2)}
                        </span>
                      ) : (
                        "--"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {txn.date}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          txn.status === "completed"
                            ? "outline"
                            : ("secondary" as const)
                        }
                      >
                        {txn.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
