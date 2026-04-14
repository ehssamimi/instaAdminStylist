"use client"

import { useState, useEffect } from "react"
import { isSuperAdmin } from "@/services/user-service"

export function useIsSuperAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(isSuperAdmin())
  }, [])

  return isAdmin
}

