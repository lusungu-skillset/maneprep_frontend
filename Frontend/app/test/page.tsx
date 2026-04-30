'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

type HealthResponse = {
  status: 'ok'
  timestamp: string
}

type TestPageState =
  | { status: 'loading' }
  | { status: 'success'; data: HealthResponse }
  | { status: 'error'; message: string }

export default function TestPage() {
  const [state, setState] = useState<TestPageState>({ status: 'loading' })

  useEffect(() => {
    let isMounted = true

    async function loadHealthCheck() {
      try {
        const data = await apiFetch<HealthResponse>('/api/health', {
          cache: 'no-store',
        })

        if (isMounted) {
          setState({ status: 'success', data })
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to reach the API.'

        if (isMounted) {
          setState({ status: 'error', message })
        }
      }
    }

    void loadHealthCheck()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-muted/40 px-6 py-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Backend connection
          </p>
          <h1 className="text-3xl font-semibold text-foreground">
            API health check
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            This page calls the backend at runtime with
            {' '}
            <code className="rounded bg-background px-1.5 py-0.5 text-foreground">
              {process.env.NEXT_PUBLIC_API_URL}
            </code>
            .
          </p>
        </header>

        <section className="rounded-lg border border-border bg-background p-6 shadow-sm">
          {state.status === 'loading' && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Loading</p>
              <p className="text-sm text-muted-foreground">
                Requesting
                {' '}
                <code>/api/health</code>
                {' '}
                from the backend.
              </p>
            </div>
          )}

          {state.status === 'success' && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">
                Backend responded successfully.
              </p>
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm text-foreground">
                {JSON.stringify(state.data, null, 2)}
              </pre>
            </div>
          )}

          {state.status === 'error' && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-destructive">
                Backend request failed.
              </p>
              <p className="text-sm text-muted-foreground">{state.message}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
