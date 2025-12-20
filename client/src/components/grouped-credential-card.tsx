import { VaultItem } from "@/lib/mock-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface GroupedCredentialCardProps {
  title: string;
  items: VaultItem[];
  isExpanded: boolean;
  onToggle: () => void;
}

export default function GroupedCredentialCard({
  title,
  items,
  isExpanded,
  onToggle,
}: GroupedCredentialCardProps) {
  return (
    <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card/50 backdrop-blur-sm cursor-pointer">
      <Button
        onClick={onToggle}
        variant="ghost"
        className="w-full h-auto p-6 flex items-center justify-between hover:bg-transparent text-left"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {items.length} account{items.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </Button>
    </Card>
  );
}
