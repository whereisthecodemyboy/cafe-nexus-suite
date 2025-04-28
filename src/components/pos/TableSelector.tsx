
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Table } from '@/data/models';

interface TableSelectorProps {
  tables: Table[];
  selectedTable: Table | null;
  onSelectTable: (table: Table | null) => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({ 
  tables, 
  selectedTable, 
  onSelectTable 
}) => {
  const [open, setOpen] = React.useState(false);
  
  // Filter only available tables
  const availableTables = tables.filter(table => 
    table.status === 'available' || (selectedTable?.id === table.id)
  );

  // Group tables by section
  const tablesBySection = availableTables.reduce((acc: Record<string, Table[]>, table) => {
    if (!acc[table.section]) {
      acc[table.section] = [];
    }
    acc[table.section].push(table);
    return acc;
  }, {});

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {selectedTable ? selectedTable.name : "Select a table..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search table..." />
          <CommandEmpty>No table found.</CommandEmpty>
          {Object.entries(tablesBySection).map(([section, sectionTables]) => (
            <CommandGroup key={section} heading={section}>
              {sectionTables.map((table) => (
                <CommandItem
                  key={table.id}
                  value={table.id}
                  onSelect={() => {
                    onSelectTable(table);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTable?.id === table.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {table.name} ({table.capacity} seats)
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandGroup heading="Options">
            <CommandItem
              onSelect={() => {
                onSelectTable(null);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedTable === null ? "opacity-100" : "opacity-0"
                )}
              />
              Takeaway
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TableSelector;
