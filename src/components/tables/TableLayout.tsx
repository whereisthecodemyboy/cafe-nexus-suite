
import React from 'react';
import { Table as TableType } from '@/data/models';

interface TableLayoutProps {
  tables: TableType[];
  selectedTable?: string | null;
  onSelectTable?: (tableId: string) => void;
}

const TableLayout: React.FC<TableLayoutProps> = ({ 
  tables, 
  selectedTable, 
  onSelectTable 
}) => {
  // Group tables by section
  const tablesBySection = tables.reduce((acc, table) => {
    const section = table.section || 'Main';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(table);
    return acc;
  }, {} as Record<string, TableType[]>);

  // Get shape CSS based on table shape
  const getShapeStyles = (table: TableType) => {
    const baseStyle = {
      width: `${table.width}px`,
      height: table.shape === 'rectangle' ? `${table.height * 0.7}px` : `${table.height}px`,
      cursor: 'pointer',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      fontSize: '0.875rem',
    } as React.CSSProperties;

    const combinedWithStyle = table.combinedWith && table.combinedWith.length > 0 
      ? { border: '2px dashed #9b87f5' }
      : {};

    if (table.status === 'occupied') {
      return { 
        ...baseStyle, 
        ...combinedWithStyle,
        backgroundColor: '#fecaca', // Light red for occupied
        color: '#b91c1c'
      };
    } else if (table.status === 'reserved') {
      return { 
        ...baseStyle, 
        ...combinedWithStyle,
        backgroundColor: '#bfdbfe', // Light blue for reserved
        color: '#1e40af'
      };
    } else {
      return { 
        ...baseStyle, 
        ...combinedWithStyle,
        backgroundColor: '#bbf7d0', // Light green for available
        color: '#166534'
      };
    }
  };

  // Get border radius based on shape
  const getBorderRadius = (shape: string) => {
    switch (shape) {
      case 'circle':
        return '50%';
      case 'rectangle':
        return '4px';
      case 'square':
        return '4px';
      default:
        return '4px';
    }
  };

  return (
    <div>
      {Object.entries(tablesBySection).map(([section, sectionTables]) => (
        <div key={section} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">{section}</h3>
          <div className="p-4 bg-muted/40 rounded-lg border">
            <div className="flex flex-wrap gap-3">
              {sectionTables.map(table => (
                <div 
                  key={table.id}
                  onClick={() => onSelectTable && onSelectTable(table.id)}
                  style={{
                    ...getShapeStyles(table),
                    borderRadius: getBorderRadius(table.shape),
                    outline: selectedTable === table.id ? '2px solid #9b87f5' : 'none',
                    outlineOffset: '2px',
                  }}
                  className="transition-all hover:scale-105 shadow-sm"
                >
                  <div className="z-10">
                    <div>{table.name}</div>
                    <div className="text-xs opacity-80">{table.capacity} seats</div>
                  </div>
                  {table.combinedWith && table.combinedWith.length > 0 && (
                    <div className="absolute top-0 right-0 transform translate-x-1/4 translate-y-[-40%] bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      +{table.combinedWith.length}
                    </div>
                  )}
                </div>
              ))}
              {sectionTables.length === 0 && (
                <div className="w-full p-8 text-center text-muted-foreground">
                  No tables in this section
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableLayout;
