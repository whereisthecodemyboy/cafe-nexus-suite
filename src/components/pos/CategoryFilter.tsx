
import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollArea className="whitespace-nowrap py-2">
      <div className="flex space-x-2 px-1">
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-full transition-colors",
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
          onClick={() => onSelectCategory("all")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-full transition-colors",
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoryFilter;
