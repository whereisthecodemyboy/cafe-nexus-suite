
import React, { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StaffSidebar } from './StaffSidebar';

interface StaffLayoutProps {
  children: ReactNode;
}

const StaffLayout = ({ children }: StaffLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StaffSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StaffLayout;
