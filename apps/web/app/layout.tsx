import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppSidebar from '@/components/app-sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Finage',
  description: 'Dual mode Investment aggregation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background">
                <div className="mx-auto flex h-full items-center justify-between px-6">
                  <div className="text-xl font-bold">Finage</div>

                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <SignedOut>
                      <SignInButton />
                    </SignedOut>

                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </div>
                </div>
              </header>

              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <SidebarInset className="px-8">{children}</SidebarInset>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
