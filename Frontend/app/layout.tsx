import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { OfflineIndicator } from '@/components/offline-indicator'
import './globals.css'

export const metadata: Metadata = {
  title: 'MANEB Prep - Exam Preparation for Malawi Students',
  description: 'Offline-first exam preparation platform for Form 1 to Form 4 students in Malawi. Practice MANEB exams anytime, anywhere.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
}

const themeInitializerScript = `
  try {
    const storedTheme = localStorage.getItem('maneb-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = storedTheme === 'dark' || (storedTheme === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', isDark ? '#1e293b' : '#2563eb');
    }
  } catch (error) {}
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body
        className="font-sans antialiased"
        style={{ ['--font-inter' as string]: 'Plus Jakarta Sans' }}
      >
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        {children}
        <Toaster />
        <OfflineIndicator />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
