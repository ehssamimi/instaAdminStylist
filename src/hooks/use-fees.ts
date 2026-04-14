'use client'

import { useCallback, useEffect, useState } from 'react'
import { feesApi } from '@/lib/api'
import type { AdminFeeDto } from '@/models/fees'

function sortFees(rows: AdminFeeDto[]): AdminFeeDto[] {
  return [...rows].sort((a, b) => a.minMonthlyCalls - b.minMonthlyCalls)
}

export function useFees() {
  const [rows, setRows] = useState<AdminFeeDto[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await feesApi.getAll()
      setRows(sortFees(Array.isArray(data) ? data : []))
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const updateRow = useCallback((id: string, patch: Partial<AdminFeeDto>) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    )
  }, [])

  return {
    rows,
    loading,
    saving,
    error,
    reload: load,
    updateRow,
    setSaving,
  }
}
