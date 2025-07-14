"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type Language = "en" | "hi"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    "return.title": "Process Returns",
    "return.sku": "SKU / Product Code",
    "return.productName": "Product Name",
    "return.condition": "Condition",
    "return.reason": "Return Reason",
    "return.location": "Location",
    "return.date": "Return Date",
    "return.scanBarcode": "Scan Barcode",
    "ai.recommendation": "AI Recommendation",
    "ai.disposition": "Recommended Action",
    "ai.generateLabel": "Generate QR Label",
  },
  hi: {
    "return.title": "रिटर्न प्रोसेस करें",
    "return.sku": "SKU / उत्पाद कोड",
    "return.productName": "उत्पाद का नाम",
    "return.condition": "स्थिति",
    "return.reason": "रिटर्न कारण",
    "return.location": "स्थान",
    "return.date": "रिटर्न तारीख",
    "return.scanBarcode": "बारकोड स्कैन करें",
    "ai.recommendation": "AI सिफारिश",
    "ai.disposition": "अनुशंसित कार्रवाई",
    "ai.generateLabel": "QR लेबल जेनरेट करें",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
