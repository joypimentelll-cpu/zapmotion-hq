import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AccessibilityWidget } from '@/components/accessibility/AccessibilityWidget';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <AccessibilityWidget />
    </div>
  );
}
