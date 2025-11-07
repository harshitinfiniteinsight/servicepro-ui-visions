import { useState } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockStockTransactions } from "@/data/mobileMockData";
import { ArrowUp, ArrowDown, Calendar, User, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const InventoryStockInOut = () => {
  const [tab, setTab] = useState("all");
  
  const stockIn = mockStockTransactions.filter(t => t.type === "In");
  const stockOut = mockStockTransactions.filter(t => t.type === "Out");
  const allTransactions = mockStockTransactions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const displayTransactions = tab === "in" ? stockIn : tab === "out" ? stockOut : allTransactions;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Stock In/Out" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14">
        {/* Tabs */}
        <div className="px-4 pt-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="in">Stock In</TabsTrigger>
              <TabsTrigger value="out">Stock Out</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Transactions List */}
        <div className="px-4 py-4 space-y-3">
          {displayTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            displayTransactions.map(transaction => {
              const isIn = transaction.type === "In";
              return (
                <div
                  key={transaction.id}
                  className="p-4 rounded-xl border bg-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {isIn ? (
                          <ArrowUp className="h-4 w-4 text-success" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-destructive" />
                        )}
                        <h4 className="font-semibold">{transaction.itemName}</h4>
                        <Badge className={cn(
                          "text-xs",
                          isIn ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"
                        )}>
                          {isIn ? "IN" : "OUT"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{transaction.user}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-xl font-bold",
                        isIn ? "text-success" : "text-destructive"
                      )}>
                        {isIn ? "+" : ""}{transaction.quantity}
                      </div>
                      <p className="text-xs text-muted-foreground">Balance: {transaction.runningBalance}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryStockInOut;
