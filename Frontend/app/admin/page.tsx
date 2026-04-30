import type { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export const metadata: Metadata = {
  title: 'MANEB Prep Admin Dashboard',
  description: 'Manage MANEB Prep subjects, topics, questions, and bulk uploads.',
}

export default function AdminPage() {
  return <AdminDashboard />
}
