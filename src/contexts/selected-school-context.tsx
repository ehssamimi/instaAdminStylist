"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface SelectedSchoolContextType {
  selectedSchoolUrl: string
  setSelectedSchoolUrl: (url: string) => void
}

const SelectedSchoolContext = createContext<SelectedSchoolContextType | undefined>(undefined)

export function SelectedSchoolProvider({ children }: { children: ReactNode }) {
  const [selectedSchoolUrl, setSelectedSchoolUrl] = useState<string>("")

  return (
    <SelectedSchoolContext.Provider value={{ selectedSchoolUrl, setSelectedSchoolUrl }}>
      {children}
    </SelectedSchoolContext.Provider>
  )
}

export function useSelectedSchool() {
  const context = useContext(SelectedSchoolContext)
  if (context === undefined) {
    throw new Error("useSelectedSchool must be used within a SelectedSchoolProvider")
  }
  return context
}
