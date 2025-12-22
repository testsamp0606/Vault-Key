import { useState } from "react";
import { MOCK_VAULT_ITEMS, CATEGORIES, VaultItem } from "@/lib/mock-data";
import CredentialCard from "@/components/credential-card";
import GroupedCredentialCard from "@/components/grouped-credential-card";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Plus, Star, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

type SortOption = "name" | "lastUsed" | "dateAdded" | "favorites";

export default function Vault() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(MOCK_VAULT_ITEMS.filter(i => i.favorite).map(i => i.id))
  );
  const [sortBy, setSortBy] = useState<SortOption>("lastUsed");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Create items with updated favorite status
  const itemsWithFavorites = MOCK_VAULT_ITEMS.map(item => ({
    ...item,
    favorite: favorites.has(item.id),
  }));

  let filteredItems = itemsWithFavorites.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.username?.toLowerCase().includes(search.toLowerCase());
    const matchesFavorite = !showOnlyFavorites || favorites.has(item.id);
    return matchesFilter && matchesSearch && matchesFavorite;
  });

  // Sort items
  filteredItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "name") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "favorites") {
      return (favorites.has(b.id) ? 1 : 0) - (favorites.has(a.id) ? 1 : 0);
    } else if (sortBy === "lastUsed") {
      const lastUsedMap: Record<string, number> = {
        "Just now": 0,
        "2 hours ago": 2,
        "30 mins ago": 0.5,
        "1 day ago": 24,
        "2 days ago": 48,
        "3 days ago": 72,
        "1 week ago": 168,
        "1 month ago": 720,
      };
      return (lastUsedMap[a.lastUsed] || 999) - (lastUsedMap[b.lastUsed] || 999);
    }
    return 0;
  });

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  // Group items by title (company name)
  const groupedItems = filteredItems.reduce((groups, item) => {
    const existing = groups.find(g => g.title === item.title);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.push({ title: item.title, items: [item] });
    }
    return groups;
  }, [] as Array<{ title: string; items: typeof MOCK_VAULT_ITEMS }>);

  const toggleGroup = (title: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedGroups(newExpanded);
  };

  // Flatten the display: if a group is expanded, show individual items; otherwise show group card
  type DisplayItem = 
    | { type: "item"; data: typeof MOCK_VAULT_ITEMS[0] }
    | { type: "group"; group: { title: string; items: typeof MOCK_VAULT_ITEMS } };
  
  const displayItems: DisplayItem[] = [];
  
  groupedItems.forEach((group) => {
    if (expandedGroups.has(group.title)) {
      // Add individual items for this group
      group.items.forEach((item) => {
        displayItems.push({ type: "item", data: item });
      });
    } else if (group.items.length === 1) {
      // Single items show directly
      displayItems.push({ type: "item", data: group.items[0] });
    } else {
      // Multiple items show as group card
      displayItems.push({ type: "group", group });
    }
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

      <div className="sticky top-[4rem] z-30 bg-background/95 backdrop-blur-sm py-4 -mx-6 px-6">
        <div className="flex gap-2 items-center flex-wrap md:flex-nowrap">
          {/* Category Filters - All on one line */}
          <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="flex-1">
            <TabsList className="bg-transparent p-0 gap-2 h-auto">
              {CATEGORIES.map(category => (
                  <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="px-3 py-1.5 rounded-md text-sm gap-1.5 border border-transparent data-[state=active]:bg-primary/10 data-[state=active]:text-foreground data-[state=active]:border-primary/30 hover:bg-muted/50 transition-colors"
                  >
                      <category.icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{category.label}</span>
                  </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Favorites Filter - Star Icon Only */}
          <Button 
            variant={showOnlyFavorites ? "default" : "outline"}
            size="sm"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            title="Show only favorites"
            className="px-2.5"
          >
            <Star className="h-4 w-4" fill={showOnlyFavorites ? "currentColor" : "none"} />
          </Button>

          {/* Search */}
          <div className="relative hidden md:block flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card h-9 text-sm"
            />
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => setSortBy("lastUsed")}
                className={sortBy === "lastUsed" ? "bg-primary/10" : ""}
              >
                <div className="flex items-center gap-2 w-full">
                  <input type="radio" checked={sortBy === "lastUsed"} readOnly className="h-4 w-4" />
                  Last Used
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("favorites")}
                className={sortBy === "favorites" ? "bg-primary/10" : ""}
              >
                <div className="flex items-center gap-2 w-full">
                  <input type="radio" checked={sortBy === "favorites"} readOnly className="h-4 w-4" />
                  Favorites
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("name")}
                className={sortBy === "name" ? "bg-primary/10" : ""}
              >
                <div className="flex items-center gap-2 w-full">
                  <input type="radio" checked={sortBy === "name"} readOnly className="h-4 w-4" />
                  Name (A-Z)
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Search Bar */}
        <div className="relative md:hidden mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card h-9 text-sm w-full"
          />
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence>
          {displayItems.map((displayItem, index) => (
            <motion.div
              key={displayItem.type === "group" ? displayItem.group.title : displayItem.data.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {displayItem.type === "group" ? (
                <GroupedCredentialCard
                  title={displayItem.group.title}
                  items={displayItem.group.items}
                  isExpanded={expandedGroups.has(displayItem.group.title)}
                  onToggle={() => toggleGroup(displayItem.group.title)}
                />
              ) : (
                <CredentialCard 
                  item={displayItem.data}
                  onFavoriteToggle={toggleFavorite}
                  isFavorite={favorites.has(displayItem.data.id)}
                />
              )}
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
