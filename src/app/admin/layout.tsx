import React from 'react';
import { AdminSidebarLayout } from '@/components/layout/AdminSidebarLayout';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminSidebarLayout>{children}</AdminSidebarLayout>;
}
