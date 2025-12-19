import { useState } from "react";
import { MOCK_VAULT_ITEMS, CATEGORIES } from "@/lib/mock-data";
import CredentialCard from "@/components/credential-card";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

export default function Vault() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredItems = MOCK_VAULT_ITEMS.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.username?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Vault</h1>
          <p className="text-muted-foreground">Manage and organize your secure credentials.</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[4rem] z-30 bg-background/95 backdrop-blur-sm py-2">
        <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="w-full md:w-auto">
          <TabsList className="bg-muted/50 p-1">
            {CATEGORIES.map(category => (
                <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                    <category.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence>
            {filteredItems.map((item) => (
            <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
            >
                <CredentialCard item={item} />
            </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>
      
      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No items found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
                We couldn't find any items matching your search or filter criteria.
            </p>
             <Button 
                variant="link" 
                onClick={() => {setFilter('all'); setSearch('')}}
                className="mt-4 text-primary"
            >
                Clear Filters
            </Button>
        </div>
      )}
    </div>
  );
}
