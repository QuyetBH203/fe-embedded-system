import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import Providers from '@/providers';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarProvider>
        <div className="flex min-h-screen w-full max-w-full mx-auto p-4">
          <div className="w-1/6">
            <AppSidebar />
          </div>

          <main className="flex w-5/6 flex-col justify-center items-center p-4">
            {/* <SidebarTrigger /> */}
            {children}
          </main>
        </div>
      </SidebarProvider>
    </Providers>
  );
}
