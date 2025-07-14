"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import {
  Camera,
  QrCode,
  CheckCircle,
  AlertCircle,
  Package,
  Truck,
  MapPin,
  Clock,
  DollarSign,
  Leaf,
  Download,
  RefreshCw,
  Zap,
  Target,
  Award,
  Globe,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Coffee,
  Settings,
  Volume2,
  VolumeX,
  Home,
  Star,
  Timer,
  Users,
  Activity,
  Wifi,
  RotateCcw,
  Scan,
} from "lucide-react"
import { BarcodeScanner } from "@/components/barcode-scanner"

interface ProcessingStep {
  id: number
  title: string
  titleHindi: string
  description: string
  descriptionHindi: string
  completed: boolean
  current: boolean
  status: "pending" | "active" | "completed" | "error"
}

interface ScannedItem {
  id: string
  name: string
  nameHindi: string
  sku: string
  condition: string
  conditionHindi: string
  estimatedValue: number
  co2Impact: number
  recommendedAction: string
  recommendedActionHindi: string
  confidence: number
  processingTime: string
  processingTimeHindi: string
  sustainabilityScore: number
  category: string
  brand: string
  weight: number
  dimensions: string
  imageUrl: string
}

interface ProcessedItem {
  id: string
  item: ScannedItem
  hub: string
  timestamp: Date
  trackingNumber: string
  status: "processed" | "shipped" | "delivered"
}

interface WorkerStats {
  itemsProcessed: number
  efficiency: number
  valueRecovered: number
  co2Saved: number
  streak: number
  todayTarget: number
  hourlyRate: number
  accuracy: number
  breakTime: number
  shiftStart: Date
  rank: number
  totalWorkers: number
}

const workerProfiles = [
  {
    name: "Rajesh Kumar",
    id: "WK001",
    itemsProcessed: 247,
    efficiency: 94,
    accuracy: 98,
    shift: "Morning",
    avatar: "/images/worker-avatar-1.png",
  },
  {
    name: "Priya Sharma",
    id: "WK002",
    itemsProcessed: 189,
    efficiency: 91,
    accuracy: 96,
    shift: "Afternoon",
    avatar: "/images/worker-avatar-2.png",
  },
  {
    name: "Amit Singh",
    id: "WK003",
    itemsProcessed: 203,
    efficiency: 89,
    accuracy: 94,
    shift: "Evening",
    avatar: "/images/worker-avatar-3.png",
  },
]

export default function WorkerInterface() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [scannedItem, setScannedItem] = useState<ScannedItem | null>(null)
  const [selectedHub, setSelectedHub] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [isOnBreak, setIsOnBreak] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [manualEntry, setManualEntry] = useState(false)
  const [processedItems, setProcessedItems] = useState<ProcessedItem[]>([])
  const [selectedWorker, setSelectedWorker] = useState(workerProfiles[0]) // Default to first worker

  const [workerStats, setWorkerStats] = useState<WorkerStats>({
    itemsProcessed: 47,
    efficiency: 94,
    valueRecovered: 85000,
    co2Saved: 23.4,
    streak: 12,
    todayTarget: 80,
    hourlyRate: 6.2,
    accuracy: 96,
    breakTime: 45,
    shiftStart: new Date(Date.now() - 4 * 60 * 60 * 1000),
    rank: 3,
    totalWorkers: 24,
  })

  const [manualData, setManualData] = useState({
    sku: "",
    condition: "",
    notes: "",
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const breakTimerRef = useRef<NodeJS.Timeout>()
  const fileInputRef = useRef<HTMLInputElement>(null) // For photo capture

  const steps: ProcessingStep[] = [
    {
      id: 1,
      title: "Scan Item",
      titleHindi: "आइटम स्कैन करें",
      description: "Scan QR code or barcode to identify the product",
      descriptionHindi: "उत्पाद की पहचान के लिए QR कोड या बारकोड स्कैन करें",
      completed: currentStep > 1,
      current: currentStep === 1,
      status: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "pending",
    },
    {
      id: 2,
      title: "AI Analysis",
      titleHindi: "AI विश्लेषण",
      description: "AI evaluates condition and determines optimal action",
      descriptionHindi: "AI स्थिति का मूल्यांकन करता है और इष्टतम कार्रवाई निर्धारत करता है",
      completed: currentStep > 2,
      current: currentStep === 2,
      status: currentStep > 2 ? "completed" : currentStep === 2 ? "active" : "pending",
    },
    {
      id: 3,
      title: "Hub Selection",
      titleHindi: "हब चयन",
      description: "Choose optimal processing hub based on AI recommendations",
      descriptionHindi: "AI सिफारिशों के आधार पर इष्टतम प्रसंस्करण हब चुनें",
      completed: currentStep > 3,
      current: currentStep === 3,
      status: currentStep > 3 ? "completed" : currentStep === 3 ? "active" : "pending",
    },
    {
      id: 4,
      title: "Complete",
      titleHindi: "पूर्ण करें",
      description: "Generate label and complete processing",
      descriptionHindi: "लेबल जेनरेट करें और प्रसंस्करण पूरा करें",
      completed: currentStep > 4,
      current: currentStep === 4,
      status: currentStep > 4 ? "completed" : currentStep === 4 ? "active" : "pending",
    },
  ]

  const availableHubs = [
    {
      id: "hub-mumbai-1",
      name: "Mumbai Processing Hub",
      nameHindi: "मुंबई प्रसंस्करण हब",
      distance: "2.3 km",
      capacity: 85,
      specialization: "Electronics & Appliances",
      specializationHindi: "इलेक्ट्रॉनिक्स और उपकरण",
      estimatedTime: "4-6 hours",
      estimatedTimeHindi: "4-6 घंटे",
      co2Impact: 1.2,
      priority: "high",
      image: "/images/ai-generated/mumbai-hub.png",
    },
    {
      id: "hub-bangalore-1",
      name: "Bangalore Refurbishment Center",
      nameHindi: "बैंगलोर नवीकरण केंद्र",
      distance: "45 km",
      capacity: 62,
      specialization: "Home & Kitchen",
      specializationHindi: "घर और रसोई",
      estimatedTime: "1-2 days",
      estimatedTimeHindi: "1-2 दिन",
      co2Impact: 3.8,
      priority: "medium",
      image: "/images/ai-generated/bangalore-hub.png",
    },
    {
      id: "hub-delhi-1",
      name: "Delhi Recycling Facility",
      nameHindi: "दिल्ली रीसाइक्लिंग सुविधा",
      distance: "78 km",
      capacity: 34,
      specialization: "Material Recovery",
      specializationHindi: "सामग्री पुनर्प्राप्ति",
      estimatedTime: "2-3 days",
      estimatedTimeHindi: "2-3 दिन",
      co2Impact: 5.2,
      priority: "low",
      image: "/images/ai-generated/delhi-hub.png",
    },
  ]

  const mockProducts = [
    {
      sku: "SAM-TV55-4K-2023",
      name: 'Samsung 55" 4K Smart TV',
      nameHindi: 'सैमसंग 55" 4K स्मार्ट टीवी',
      category: "Electronics",
      brand: "Samsung",
      estimatedValue: 35000,
      weight: 18.5,
      dimensions: "123x71x8 cm",
      image: "/images/ai-generated/samsung-tv.png",
    },
    {
      sku: "XIAO-REDMI-12-BLU",
      name: "Xiaomi Redmi 12 Blue",
      nameHindi: "शाओमी रेडमी 12 नीला",
      category: "Electronics",
      brand: "Xiaomi",
      estimatedValue: 12000,
      weight: 0.2,
      dimensions: "16x7.5x0.8 cm",
      image: "/images/ai-generated/xiaomi-phone.png",
    },
    {
      sku: "BOAT-HEADPH-BLK",
      name: "boAt Rockerz Headphones",
      nameHindi: "बोट रॉकर्ज हेडफोन",
      category: "Electronics",
      brand: "boAt",
      estimatedValue: 2500,
      weight: 0.3,
      dimensions: "20x18x8 cm",
      image: "/images/ai-generated/boat-headphones.png",
    },
    {
      sku: "NIKE-AIRMAX-270",
      name: "Nike Air Max 270",
      nameHindi: "नाइके एयर मैक्स 270",
      category: "Fashion",
      brand: "Nike",
      estimatedValue: 4500,
      weight: 0.8,
      dimensions: "30x20x12 cm",
      image: "/images/ai-generated/nike-shoes.png",
    },
    {
      sku: "PHILIPS-AIRFRYER-XL",
      name: "Philips Air Fryer XL",
      nameHindi: "फिलिप्स एयर फ्रायर XL",
      category: "Home & Kitchen",
      brand: "Philips",
      estimatedValue: 3200,
      weight: 5.5,
      dimensions: "35x30x30 cm",
      image: "/images/ai-generated/air-fryer.png",
    },
  ]

  // Initialize camera
  useEffect(() => {
    if (isScanning && !manualEntry) {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [isScanning, manualEntry])

  // Break timer
  useEffect(() => {
    if (isOnBreak) {
      breakTimerRef.current = setInterval(() => {
        setWorkerStats((prev) => ({
          ...prev,
          breakTime: prev.breakTime + 1,
        }))
      }, 60000)
    } else {
      if (breakTimerRef.current) {
        clearInterval(breakTimerRef.current)
      }
    }
    return () => {
      if (breakTimerRef.current) {
        clearInterval(breakTimerRef.current)
      }
    }
  }, [isOnBreak])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const playSound = (type: "success" | "error" | "scan") => {
    if (!soundEnabled) return
    console.log(`Playing ${type} sound`)
  }

  const handleScan = async () => {
    if (isOnBreak) {
      toast({
        title: "Break Mode Active",
        description: "Please end your break to continue processing.",
        variant: "destructive",
      })
      return
    }

    setIsScanning(true)
  }

  const handleBarcodeScan = (code: string) => {
    setIsScanning(false)
    playSound("scan")

    // Find product by scanned code or use random product
    const scannedProduct =
      mockProducts.find((p) => p.sku.includes(code.toUpperCase()) || code.includes(p.sku.split("-")[0])) ||
      mockProducts[Math.floor(Math.random() * mockProducts.length)]

    const conditions = ["New", "Lightly Used", "Good", "Fair", "Damaged"]
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

    const mockItem: ScannedItem = {
      id: `SR-${Date.now()}`,
      name: scannedProduct.name,
      nameHindi: scannedProduct.nameHindi,
      sku: code.toUpperCase(),
      condition: randomCondition,
      conditionHindi: randomCondition,
      estimatedValue: scannedProduct.estimatedValue,
      co2Impact: Math.round(scannedProduct.estimatedValue * 0.0003 * 100) / 100,
      recommendedAction: randomCondition === "New" ? "Resale" : randomCondition === "Damaged" ? "Repair" : "Refurbish",
      recommendedActionHindi:
        randomCondition === "New" ? "पुनर्विक्रय" : randomCondition === "Damaged" ? "मरम्मत" : "नवीकरण",
      confidence: Math.floor(Math.random() * 20) + 80,
      processingTime: "4-6 hours",
      processingTimeHindi: "4-6 घंटे",
      sustainabilityScore: Math.floor(Math.random() * 30) + 70,
      category: scannedProduct.category,
      brand: scannedProduct.brand,
      weight: scannedProduct.weight,
      dimensions: scannedProduct.dimensions,
      imageUrl: scannedProduct.image,
    }

    setScannedItem(mockItem)
    setCurrentStep(2)
    playSound("success")

    toast({
      title: language === "en" ? "Item Scanned Successfully" : "आइटम सफलतापूर्वक स्कैन किया गया",
      description: `${language === "en" ? mockItem.name : mockItem.nameHindi} - ${mockItem.confidence}% confidence`,
    })

    setTimeout(() => {
      handleAIRecommendation()
    }, 2000)
  }

  const closeBarcodeScanner = () => {
    setIsScanning(false)
  }

  const handleManualEntry = () => {
    if (!manualData.sku || !manualData.condition) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const mockProduct = mockProducts.find((p) => p.sku.includes(manualData.sku.toUpperCase())) || mockProducts[0]

    const mockItem: ScannedItem = {
      id: `SR-MANUAL-${Date.now()}`,
      name: mockProduct.name,
      nameHindi: mockProduct.nameHindi,
      sku: manualData.sku.toUpperCase(),
      condition: manualData.condition,
      conditionHindi: manualData.condition,
      estimatedValue: mockProduct.estimatedValue,
      co2Impact: Math.round(mockProduct.estimatedValue * 0.0003 * 100) / 100,
      recommendedAction: manualData.condition === "New" ? "Resale" : "Repair",
      recommendedActionHindi: manualData.condition === "New" ? "पुनर्विक्रय" : "मरम्मत",
      confidence: 85,
      processingTime: "4-6 hours",
      processingTimeHindi: "4-6 घंटे",
      sustainabilityScore: 80,
      category: mockProduct.category,
      brand: mockProduct.brand,
      weight: mockProduct.weight,
      dimensions: mockProduct.dimensions,
      imageUrl: mockProduct.image,
    }

    setScannedItem(mockItem)
    setCurrentStep(2)
    setManualEntry(false)
    setManualData({ sku: "", condition: "", notes: "" })

    setTimeout(() => {
      handleAIRecommendation()
    }, 1000)
  }

  const handleAIRecommendation = () => {
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setCurrentStep(3)
      playSound("success")

      toast({
        title: language === "en" ? "AI Analysis Complete" : "AI विश्लेषण पूर्ण",
        description: language === "en" ? "Optimal processing strategy determined" : "इष्टतम प्रसंस्करण रणनीति निर्धारित",
      })
    }, 2500)
  }

  const handleHubSelection = (hubId: string) => {
    setSelectedHub(hubId)
    setCurrentStep(4)

    const selectedHubData = availableHubs.find((hub) => hub.id === hubId)
    toast({
      title: language === "en" ? "Hub Selected" : "हब चुना गया",
      description:
        language === "en"
          ? `Item will be processed at ${selectedHubData?.name}`
          : `आइटem ${selectedHubData?.nameHindi} में प्रसंस्करित किया जाएगा`,
    })
  }

  const generateTrackingNumber = () => {
    return `SR-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  }

  const printQRLabel = (trackingNumber: string, item: ScannedItem, hub: string) => {
    const hubData = availableHubs.find((h) => h.id === hub)

    // Create a printable label
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Processing Label - ${trackingNumber}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                background: white;
              }
              .label {
                border: 2px solid #000;
                padding: 20px;
                max-width: 400px;
                margin: 0 auto;
              }
              .header {
                text-align: center;
                border-bottom: 1px solid #ccc;
                padding-bottom: 10px;
                margin-bottom: 15px;
              }
              .qr-placeholder {
                width: 150px;
                height: 150px;
                border: 2px dashed #666;
                margin: 15px auto;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: #666;
                text-align: center;
              }
              .info {
                margin: 8px 0;
                font-size: 14px;
              }
              .tracking {
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                margin: 15px 0;
                letter-spacing: 2px;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="label">
              <div class="header">
                <h2>SmartReturns Processing Label</h2>
                <p>SmartReturns Processing Hub</p>
              </div>

              <div class="tracking">${trackingNumber}</div>

              <div class="qr-placeholder">
                QR CODE<br/>
                (${trackingNumber})
              </div>

              <div class="info"><strong>Item:</strong> ${item.name}</div>
              <div class="info"><strong>SKU:</strong> ${item.sku}</div>
              <div class="info"><strong>Condition:</strong> ${item.condition}</div>
              <div class="info"><strong>Action:</strong> ${item.recommendedAction}</div>
              <div class="info"><strong>Value:</strong> ₹${item.estimatedValue.toLocaleString()}</div>
              <div class="info"><strong>Destination:</strong> ${hubData?.name}</div>
              <div class="info"><strong>Distance:</strong> ${hubData?.distance}</div>
              <div class="info"><strong>ETA:</strong> ${hubData?.estimatedTime}</div>
              <div class="info"><strong>Processed:</strong> ${new Date().toLocaleString()}</div>

              <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #ccc; font-size: 12px; color: #666;">
                <div>CO₂ Impact: ${item.co2Impact} kg saved</div>
                <div>Sustainability Score: ${item.sustainabilityScore}/100</div>
              </div>

              <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px;">Print Label</button>
                <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; margin-left: 10px;">Close</button>
              </div>
            </div>

            <script>
              setTimeout(() => {
                window.print();
              }, 1000);
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const completeProcessing = () => {
    if (!scannedItem || !selectedHub) return

    const trackingNumber = generateTrackingNumber()
    const processedItem: ProcessedItem = {
      id: trackingNumber,
      item: scannedItem,
      hub: selectedHub,
      timestamp: new Date(),
      trackingNumber,
      status: "processed",
    }

    setProcessedItems((prev) => [processedItem, ...prev.slice(0, 9)])

    setWorkerStats((prev) => ({
      ...prev,
      itemsProcessed: prev.itemsProcessed + 1,
      valueRecovered: prev.valueRecovered + scannedItem.estimatedValue,
      co2Saved: prev.co2Saved + scannedItem.co2Impact,
      streak: prev.streak + 1,
      hourlyRate: (prev.itemsProcessed + 1) / ((Date.now() - prev.shiftStart.getTime()) / (1000 * 60 * 60)),
    }))

    // Generate and print QR label
    printQRLabel(trackingNumber, scannedItem, selectedHub)

    playSound("success")
    toast({
      title: language === "en" ? "Item Processed Successfully" : "आइटम सफलतापूर्वक प्रसंस्करित",
      description:
        language === "en"
          ? `Tracking: ${trackingNumber} - Label printed`
          : `ट्रैकिंग: ${trackingNumber} - लेबल प्रिंट किया गया`,
    })

    setTimeout(() => {
      resetWorkflow()
    }, 3000)
  }

  const resetWorkflow = () => {
    setCurrentStep(1)
    setScannedItem(null)
    setSelectedHub("")
    setIsScanning(false)
    setIsProcessing(false)
    setManualEntry(false)
  }

  const toggleBreak = () => {
    setIsOnBreak(!isOnBreak)
    toast({
      title: isOnBreak ? "Break Ended" : "Break Started",
      description: isOnBreak ? "Welcome back! Ready to process items." : "Enjoy your break!",
    })
  }

  const handlePhotoCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you'd upload this file and get a URL
      // For now, we just acknowledge it and move to the next step
      toast({
        title: "Photos Captured",
        description: "Item condition documented successfully",
      })
      // Assuming photo capture is part of AI analysis step, or a separate step
      // For this flow, let's assume it's part of the AI analysis and moves to hub selection
      setCurrentStep(3) // Move to hub selection after photo capture
    }
  }

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Scan className="h-5 w-5" />
      case 2:
        return <Camera className="h-5 w-5" />
      case 3:
        return <Truck className="h-5 w-5" />
      case 4:
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Scan className="h-5 w-5" />
    }
  }

  const getStepColor = (step: number) => {
    if (step < currentStep) return "bg-green-500 text-white"
    if (step === currentStep) return "bg-blue-500 text-white"
    return "bg-gray-200 text-gray-600"
  }

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        title: "SmartReturns Worker Station",
        subtitle: "SmartReturns Processing Hub",
        shift: "Day Shift (9AM-6PM)",
        station: "Station FK-001",
        itemsProcessed: "Items Processed",
        efficiency: "Efficiency",
        valueRecovered: "Value Recovered",
        co2Saved: "CO₂ Saved",
        successStreak: "Success Streak",
        todayTarget: "Today's Target",
        hourlyRate: "Hourly Rate",
        accuracy: "Accuracy",
        processingWorkflow: "Processing Workflow",
        followSteps: "Follow these steps to process each return efficiently",
        scanWithCamera: "Scan with Camera",
        manualEntry: "Manual Entry",
        scanningItem: "Scanning item...",
        aiAnalyzing: "AI analyzing item...",
        recommendedAction: "Recommended Action:",
        confidence: "Confidence:",
        estimatedValue: "Estimated Value:",
        co2Impact: "CO₂ Impact:",
        selectProcessingHub: "Select Processing Hub",
        generatePrintLabel: "Generate & Print Label",
        readyForProcessing: "Ready for Processing",
        itemAnalyzed: "Item analyzed and hub selected. Generate label to complete processing.",
        printLabel: "Complete Processing",
        quickActions: "Quick Actions",
        commonTasks: "Common tasks and shortcuts",
        resetWorkflow: "Reset Workflow",
        bulkProcessing: "Bulk processing",
        reportIssue: "Report Issue",
        breakTimer: "Break Timer",
        recentActivity: "Recent Activity",
        performance: "Performance",
        settings: "Settings",
        rank: "Rank",
        of: "of",
        capturePhotos: "Capture Photos",
        documentCondition: "Document item condition with photos",
        confirmProcess: "Confirm & Process",
        processingQueue: "Processing Queue",
        myPerformance: "My Performance",
        dailyProgress: "Daily Progress",
        settingsPreferences: "Settings & Preferences",
        audioSettings: "Audio Settings",
        soundEffects: "Sound Effects",
        enableAudioFeedback: "Enable audio feedback for actions",
        displaySettings: "Display Settings",
        interfaceLanguage: "Interface language",
        editProfile: "Edit Profile",
        noItemsProcessed: "No items processed yet today",
        viewDetailedReport: "View Detailed Report",
        profile: "Profile",
        queue: "Kyu",
        stats: "Stats",
        scanner: "Scanner",
        itemsToday: "Items Today",
        efficiencyMetric: "Efficiency",
        accuracyMetric: "Accuracy",
        itemsProcessedToday: "Items Today",
        hourlyRateMetric: "Hourly Rate",
        accuracyRateMetric: "Accuracy Rate",
      },
      hi: {
        title: "स्मार्टरिटर्न्स वर्कर स्टेशन",
        subtitle: "स्मार्टरिटर्न्स प्रसंस्करण हब",
        shift: "दिन शिफ्ट (9AM-6PM)",
        station: "स्टेशन FK-001",
        itemsProcessed: "प्रसंस्करित आइटम",
        efficiency: "दक्षता",
        valueRecovered: "मूल्य पुनर्प्राप्त",
        co2Saved: "CO₂ बचाया गया",
        successStreak: "सफलता की लकीर",
        todayTarget: "आज का लक्ष्य",
        hourlyRate: "प्रति घंटा दर",
        accuracy: "सटीकता",
        processingWorkflow: "प्रसंस्करण वर्कफ़्लो",
        followSteps: "प्रत्येक रिटर्न को कुशलतापूर्वक प्रसंस्करित करने के लिए इन चरणों का पालन करें",
        scanWithCamera: "कैमरे से स्कैन करें",
        manualEntry: "मैन्युअल एंट्री",
        scanningItem: "आइटम स्कैन कर रहे हैं...",
        aiAnalyzing: "AI आइटम का विश्लेषण कर रहा है...",
        recommendedAction: "अनुशंसित कार्रवाई:",
        confidence: "विश्वास:",
        estimatedValue: "अनुमानित मूल्य:",
        co2Impact: "CO₂ प्रभाव:",
        selectProcessingHub: "प्रसंस्करण हब चुनें",
        generatePrintLabel: "लेबल जेनरेट और प्रिंट करें",
        readyForProcessing: "प्रसंस्करण के लिए तैयार",
        itemAnalyzed: "आइटम का विश्लेषण किया गया और हब चुना गया। प्रसंस्करण पूरा करने के लिए लेबल जेनरेट करें।",
        printLabel: "प्रसंस्करण पूरा करें",
        quickActions: "त्वरित कार्रवाई",
        commonTasks: "सामान्य कार्य और शॉर्टकट",
        resetWorkflow: "वर्कफ़्लो रीसेट करें",
        bulkProcessing: "बल्क प्रसंस्करण",
        reportIssue: "समस्या की रिपोर्ट करें",
        breakTimer: "ब्रेक टाइमर",
        recentActivity: "हाल की गतिविधि",
        performance: "प्रदर्शन",
        settings: "सेटिंग्स",
        rank: "रैंक",
        of: "का",
        capturePhotos: "तस्वीरें कैप्चर करें",
        documentCondition: "तस्वीरों के साथ आइटम की स्थिति का दस्तावेजीकरण करें",
        confirmProcess: "पुष्टि करें और प्रक्रिया करें",
        processingQueue: "प्रसंस्करण कतार",
        myPerformance: "मेरा प्रदर्शन",
        dailyProgress: "दैनिक प्रगति",
        settingsPreferences: "सेटिंग्स और प्राथमिकताएं",
        audioSettings: "ऑडियो सेटिंग्स",
        soundEffects: "ध्वनि प्रभाव",
        enableAudioFeedback: "कार्रवाइयों के लिए ऑडियो फीडबैक सक्षम करें",
        displaySettings: "प्रदर्शन सेटिंग्स",
        interfaceLanguage: "इंटरफ़ेस भाषा",
        editProfile: "प्रोफ़ाइल संपादित करें",
        noItemsProcessed: "आज कोई आइटम संसाधित नहीं हुआ",
        viewDetailedReport: "विस्तृत रिपोर्ट देखें",
        profile: "प्रोफ़ाइल",
        queue: "कतार",
        stats: "आँकड़े",
        scanner: "स्कैनर",
        itemsToday: "आज के आइटम",
        efficiencyMetric: "दक्षता",
        accuracyMetric: "सटीकता",
        itemsProcessedToday: "आज संसाधित आइटम",
        hourlyRateMetric: "प्रति घंटा दर",
        accuracyRateMetric: "सटीकता दर",
      },
    }
    return translations[language][key] || key
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 ${fullscreen ? "fixed inset-0 z-50" : ""}`}
    >
      {/* Worker Interface Background */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/images/ai-generated/worker-interface-bg.png"
          alt="Worker Interface Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 space-y-6">
        {/* Enhanced Header with Logo */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-white via-blue-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                  <Image
                    src="/images/smartreturns-logo.png"
                    alt="SmartReturns Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    {t("title")}
                  </h1>
                  <p className="text-gray-600 font-medium">{t("subtitle")}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {t("shift")}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {t("station")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {t("rank")} {workerStats.rank} {t("of")} {workerStats.totalWorkers}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">Online</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-lg">
                  <Wifi className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                    className="hover:scale-105 transition-transform"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    {language === "en" ? "हिं" : "EN"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="hover:scale-105 transition-transform"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant={isOnBreak ? "default" : "outline"}
                    size="sm"
                    onClick={toggleBreak}
                    className={`hover:scale-105 transition-transform ${isOnBreak ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                  >
                    <Coffee className="w-4 h-4 mr-1" />
                    {isOnBreak ? "End Break" : "Break"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Break Mode Alert */}
        {isOnBreak && (
          <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
            <Coffee className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 font-medium">
              🛑 Break mode is active. Processing is paused. Break time: {workerStats.breakTime} minutes
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="processing" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg p-1">
            <TabsTrigger value="processing" className="hover:scale-105 transition-transform">
              <Activity className="w-4 h-4 mr-2" />
              Processing
            </TabsTrigger>
            <TabsTrigger value="performance" className="hover:scale-105 transition-transform">
              <BarChart3 className="w-4 h-4 mr-2" />
              {t("performance")}
            </TabsTrigger>
            <TabsTrigger value="activity" className="hover:scale-105 transition-transform">
              <Timer className="w-4 h-4 mr-2" />
              {t("recentActivity")}
            </TabsTrigger>
            <TabsTrigger value="settings" className="hover:scale-105 transition-transform">
              <Settings className="w-4 h-4 mr-2" />
              {t("settings")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="processing" className="space-y-6">
            {/* Performance Dashboard */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-green-600 font-semibold">{t("itemsProcessed")}</p>
                      <p className="text-3xl font-bold text-green-700">{workerStats.itemsProcessed}</p>
                      <p className="text-xs text-green-600">Target: {workerStats.todayTarget}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <Progress value={(workerStats.itemsProcessed / workerStats.todayTarget) * 100} className="h-2" />
                  <p className="text-xs text-gray-500 mt-2">
                    {Math.round((workerStats.itemsProcessed / workerStats.todayTarget) * 100)}% of daily target
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-blue-600 font-semibold">{t("efficiency")}</p>
                      <p className="text-3xl font-bold text-blue-700">{workerStats.efficiency}%</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">+2.3%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <Progress value={workerStats.efficiency} className="h-2" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-purple-600 font-semibold">{t("valueRecovered")}</p>
                      <p className="text-2xl font-bold text-purple-700">
                        ₹{(workerStats.valueRecovered / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-purple-600">
                        Avg: ₹{Math.round(workerStats.valueRecovered / workerStats.itemsProcessed).toLocaleString()}
                        /item
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Progress
                      value={Math.min((workerStats.valueRecovered / 100000) * 100, 100)}
                      className="flex-1 h-2"
                    />
                    <span className="text-xs text-gray-500">₹100K goal</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-teal-50 to-cyan-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-teal-600 font-semibold">{t("co2Saved")}</p>
                      <p className="text-3xl font-bold text-teal-700">{workerStats.co2Saved} kg</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Leaf className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">+0.8kg today</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-teal-600" />
                    </div>
                  </div>
                  <Progress value={Math.min((workerStats.co2Saved / 50) * 100, 100)} className="h-2" />
                  <p className="text-xs text-gray-500 mt-2">50kg monthly target</p>
                </CardContent>
              </Card>
            </div>

            {/* Processing Steps with Background */}
            <Card className="border-0 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <Image
                  src="/images/ai-generated/processing-workflow.png"
                  alt="Processing Workflow"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      {t("processingWorkflow")}
                    </h3>
                    <p className="text-gray-600 text-sm font-normal">{t("followSteps")}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                {/* Step Progress Indicator */}
                <div className="flex items-center justify-between mb-8 px-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepColor(step)}`}>
                        {getStepIcon(step)}
                      </div>
                      <p className="text-xs mt-1 text-center">
                        {step === 1 && (language === "en" ? "Scan" : "स्कैन")}
                        {step === 2 && (language === "en" ? "AI Analysis" : "AI विश्लेषण")}
                        {step === 3 && (language === "en" ? "Hub Select" : "हब चयन")}
                        {step === 4 && (language === "en" ? "Complete" : "पूर्ण")}
                      </p>
                    </div>
                  ))}
                </div>
                <Progress value={(currentStep / 4) * 100} className="mb-4" />
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Step 1: Scan Item */}
              <Card
                className={`border-0 shadow-xl ${currentStep === 1 ? "ring-4 ring-blue-500/30 shadow-2xl shadow-blue-500/20" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <QrCode className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        {language === "en" ? "Step 1: Scan Item" : "चरण 1: आइटम स्कैन करें"}
                      </h3>
                      <p className="text-sm text-gray-600 font-normal">
                        {language === "en"
                          ? "Use camera or barcode scanner to identify the product"
                          : "उत्पाद की पहचान के लिए कैमरा या बारकोड स्कैनर का उपयोग करें"}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Button
                      onClick={handleScan}
                      disabled={isScanning || currentStep !== 1 || isOnBreak}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 h-12"
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                          {language === "en" ? "Scanning..." : "स्कैन कर रहे हैं..."}
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-5 w-5" />
                          {t("scanWithCamera")}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={currentStep !== 1 || isOnBreak}
                      onClick={() => setManualEntry(!manualEntry)}
                      className="hover:scale-105 transition-transform"
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      Manual
                    </Button>
                  </div>

                  {/* Barcode Scanner */}
                  {isScanning && !manualEntry && (
                    <BarcodeScanner isOpen={isScanning} onScan={handleBarcodeScan} onClose={closeBarcodeScanner} />
                  )}

                  {/* Manual Entry Form */}
                  {manualEntry && (
                    <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-2xl">
                      <div>
                        <Label htmlFor="sku" className="font-semibold">
                          SKU / Product Code
                        </Label>
                        <Input
                          id="sku"
                          value={manualData.sku}
                          onChange={(e) => setManualData((prev) => ({ ...prev, sku: e.target.value }))}
                          placeholder="Enter SKU or product code"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="condition" className="font-semibold">
                          Condition
                        </Label>
                        <Select
                          value={manualData.condition}
                          onValueChange={(value) => setManualData((prev) => ({ ...prev, condition: value }))}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Lightly Used">Lightly Used</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Damaged">Damaged</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="notes" className="font-semibold">
                          Notes (Optional)
                        </Label>
                        <Textarea
                          id="notes"
                          value={manualData.notes}
                          onChange={(e) => setManualData((prev) => ({ ...prev, notes: e.target.value }))}
                          placeholder="Additional notes about the item"
                          rows={3}
                          className="mt-2"
                        />
                      </div>
                      <Button
                        onClick={handleManualEntry}
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Process Item
                      </Button>
                    </div>
                  )}

                  {isScanning && (
                    <div className="text-center py-8">
                      <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                        <Image
                          src="/images/ai-generated/barcode-scanner.png"
                          alt="Barcode Scanner"
                          fill
                          className="object-contain p-4"
                        />
                        <QrCode className="w-16 h-16 text-blue-600 animate-pulse absolute" />
                      </div>
                      <p className="text-gray-600 font-medium">{t("scanningItem")}</p>
                      <Progress value={75} className="mt-4 max-w-xs mx-auto" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Step 2: AI Analysis */}
              <Card
                className={`border-0 shadow-xl ${currentStep === 2 ? "ring-4 ring-blue-500/30 shadow-2xl shadow-blue-500/20" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        {language === "en" ? "Step 2: AI Analysis" : "चरण 2: AI विश्लेषण"}
                      </h3>
                      <p className="text-sm text-gray-600 font-normal">
                        {language === "en"
                          ? "AI evaluates condition and determines optimal processing"
                          : "AI स्थिति का मूल्यांकन करता है और इष्टतम प्रसंस्करण निर्धारित करता है"}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {scannedItem && (
                    <div className="space-y-6">
                      <div className="flex gap-4 p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-100">
                        <div className="relative w-20 h-20 rounded-xl shadow-md overflow-hidden bg-gray-100">
                          <Image
                            src={scannedItem.imageUrl || "/images/ai-generated/electronics-category.png"}
                            alt={scannedItem.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {language === "en" ? scannedItem.name : scannedItem.nameHindi}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium">SKU: {scannedItem.sku}</p>
                          <p className="text-sm text-gray-600">
                            {language === "en" ? "Condition:" : "स्थिति:"}{" "}
                            <span className="font-medium">
                              {language === "en" ? scannedItem.condition : scannedItem.conditionHindi}
                            </span>
                          </p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {scannedItem.weight}kg
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {scannedItem.dimensions}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isProcessing ? (
                        <div className="text-center py-8">
                          <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                            <Image
                              src="/images/ai-generated/ai-processing.png"
                              alt="AI Processing"
                              fill
                              className="object-contain p-2"
                            />
                            <RefreshCw className="h-8 w-8 animate-spin text-purple-600 absolute" />
                          </div>
                          <p className="text-gray-600 font-medium">{t("aiAnalyzing")}</p>
                          <Progress value={75} className="mt-4 max-w-xs mx-auto" />
                        </div>
                      ) : currentStep > 2 ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                              <span className="text-sm text-green-600 font-medium">{t("recommendedAction")}</span>
                              <div className="mt-2">
                                <Badge className="bg-green-100 text-green-800 border-green-300 text-base px-4 py-2">
                                  {language === "en"
                                    ? scannedItem.recommendedAction
                                    : scannedItem.recommendedActionHindi}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                              <span className="text-sm text-blue-600 font-medium">{t("confidence")}</span>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-2xl font-bold text-blue-700">{scannedItem.confidence}%</span>
                                <div className="flex-1">
                                  <Progress value={scannedItem.confidence} className="h-2" />
                                </div>
                              </div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                              <span className="text-sm text-purple-600 font-medium">{t("estimatedValue")}</span>
                              <div className="mt-2">
                                <span className="text-2xl font-bold text-purple-700">
                                  ₹{scannedItem.estimatedValue.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                              <span className="text-sm text-green-600 font-medium">{t("co2Impact")}</span>
                              <div className="mt-2 flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-green-600" />
                                <span className="text-xl font-bold text-green-700">
                                  {scannedItem.co2Impact} kg saved
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-teal-600 font-medium">Sustainability Score:</span>
                              <div className="flex items-center gap-3">
                                <Progress value={scannedItem.sustainabilityScore} className="w-24 h-3" />
                                <span className="text-xl font-bold text-teal-700">
                                  {scannedItem.sustainabilityScore}/100
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button onClick={handlePhotoCapture} className="w-full" size="lg">
                            <Camera className="mr-2 h-4 w-4" />
                            {t("capturePhotos")}
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileUpload}
                            className="hidden"
                            multiple // Allow multiple files for front, back, sides, defects
                          />
                        </div>
                      ) : null}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Step 3: Hub Selection */}
              <Card
                className={`border-0 shadow-xl ${currentStep === 3 ? "ring-4 ring-blue-500/30 shadow-2xl shadow-blue-500/20" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Truck className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        {language === "en" ? "Step 3: Select Processing Hub" : "चरण 3: प्रसंस्करण हब चुनें"}
                      </h3>
                      <p className="text-sm text-gray-600 font-normal">
                        {language === "en"
                          ? "Choose the optimal hub based on AI recommendations"
                          : "AI सिफारिशों के आधार पर इष्टतम हब चुनें"}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentStep >= 3 && (
                    <div className="space-y-4">
                      {availableHubs.map((hub) => (
                        <div
                          key={hub.id}
                          className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                            selectedHub === hub.id
                              ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/20"
                              : "border-gray-200 hover:border-gray-300 bg-gradient-to-br from-white to-gray-50"
                          }`}
                          onClick={() => handleHubSelection(hub.id)}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={hub.image || "/placeholder.svg"}
                                alt={hub.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-900 text-lg">
                                  {language === "en" ? hub.name : hub.nameHindi}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={`font-semibold ${
                                      hub.priority === "high"
                                        ? "border-green-500 text-green-700 bg-green-50"
                                        : hub.priority === "medium"
                                          ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                                          : "border-red-500 text-red-700 bg-red-50"
                                    }`}
                                  >
                                    {hub.priority.toUpperCase()}
                                  </Badge>
                                  {selectedHub === hub.id && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">Distance: {hub.distance}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">
                                ETA: {language === "en" ? hub.estimatedTime : hub.estimatedTimeHindi}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">Capacity: {hub.capacity}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Leaf className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">CO₂: {hub.co2Impact}kg</span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Specialization:</span>{" "}
                              {language === "en" ? hub.specialization : hub.specializationHindi}
                            </p>
                            <Progress value={hub.capacity} className="mt-2 h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Step 4: Complete Processing */}
              <Card
                className={`border-0 shadow-xl ${currentStep === 4 ? "ring-4 ring-blue-500/30 shadow-2xl shadow-blue-500/20" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        {language === "en" ? "Step 4: Complete Processing" : "चरण 4: प्रसंस्करण पूरा करें"}
                      </h3>
                      <p className="text-sm text-gray-600 font-normal">
                        {language === "en"
                          ? "Generate tracking label and finalize processing"
                          : "ट्रैकिंग लेबल जेनरेट करें और प्रसंस्करण को अंतिम रूप दें"}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentStep === 4 && scannedItem && selectedHub && (
                    <div className="space-y-6">
                      <Alert className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 font-medium">
                          {t("readyForProcessing")}
                        </AlertDescription>
                      </Alert>

                      <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4">Processing Summary</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Item:</span>
                            <p className="font-medium">
                              {language === "en" ? scannedItem.name : scannedItem.nameHindi}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">SKU:</span>
                            <p className="font-medium">{scannedItem.sku}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Action:</span>
                            <p className="font-medium">
                              {language === "en" ? scannedItem.recommendedAction : scannedItem.recommendedActionHindi}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Hub:</span>
                            <p className="font-medium">
                              {language === "en"
                                ? availableHubs.find((h) => h.id === selectedHub)?.name
                                : availableHubs.find((h) => h.id === selectedHub)?.nameHindi}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Value:</span>
                            <p className="font-medium">₹{scannedItem.estimatedValue.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">CO₂ Saved:</span>
                            <p className="font-medium">{scannedItem.co2Impact} kg</p>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={completeProcessing}
                        className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Download className="mr-3 h-6 w-6" />
                        {t("printLabel")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {t("quickActions")}
                    </h3>
                    <p className="text-gray-600 text-sm font-normal">{t("commonTasks")}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                  <Button
                    variant="outline"
                    onClick={resetWorkflow}
                    className="h-20 flex-col gap-2 hover:scale-105 transition-transform bg-transparent"
                  >
                    <RotateCcw className="h-6 w-6" />
                    <span className="text-sm">{t("resetWorkflow")}</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("/worker/bulk", "_blank")}
                    className="h-20 flex-col gap-2 hover:scale-105 transition-transform"
                  >
                    <Package className="h-6 w-6" />
                    <span className="text-sm">{t("bulkProcessing")}</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast({
                        title: "Issue Reported",
                        description: "Technical support has been notified.",
                      })
                    }
                    className="h-20 flex-col gap-2 hover:scale-105 transition-transform"
                  >
                    <AlertTriangle className="h-6 w-6" />
                    <span className="text-sm">{t("reportIssue")}</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("/", "_blank")}
                    className="h-20 flex-col gap-2 hover:scale-105 transition-transform"
                  >
                    <Home className="h-6 w-6" />
                    <span className="text-sm">Dashboard</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-yellow-600" />
                    {t("myPerformance")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div>
                        <p className="text-sm text-green-600 font-medium">{t("successStreak")}</p>
                        <p className="text-2xl font-bold text-green-700">{workerStats.streak} items</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Star className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">{t("hourlyRateMetric")}</p>
                        <p className="text-2xl font-bold text-blue-700">{workerStats.hourlyRate.toFixed(1)} items/hr</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Timer className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">{t("accuracyRateMetric")}</p>
                        <p className="text-2xl font-bold text-purple-700">{workerStats.accuracy}%</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Target className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                    {t("dailyProgress")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{t("itemsProcessedToday")}</span>
                        <span>
                          {workerStats.itemsProcessed}/{workerStats.todayTarget}
                        </span>
                      </div>
                      <Progress value={(workerStats.itemsProcessed / workerStats.todayTarget) * 100} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{t("efficiencyMetric")}</span>
                        <span>{workerStats.efficiency}%</span>
                      </div>
                      <Progress value={workerStats.efficiency} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{t("accuracyMetric")}</span>
                        <span>{workerStats.accuracy}%</span>
                      </div>
                      <Progress value={workerStats.accuracy} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-green-600" />
                  {t("recentActivity")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processedItems.length > 0 ? (
                    processedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.item.imageUrl || "/images/ai-generated/electronics-category.png"}
                            alt={item.item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.item.name}</h4>
                          <p className="text-sm text-gray-600">
                            {item.trackingNumber} • {item.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">₹{item.item.estimatedValue.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{item.item.co2Impact}kg CO₂</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">{t("noItemsProcessed")}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-gray-600" />
                  {t("settingsPreferences")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">{t("audioSettings")}</h4>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium">{t("soundEffects")}</p>
                        <p className="text-sm text-gray-600">{t("enableAudioFeedback")}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
                        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">{t("displaySettings")}</h4>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium">{t("language")}</p>
                        <p className="text-sm text-gray-600">{t("interfaceLanguage")}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "hi" : "en")}>
                        <Globe className="h-4 w-4 mr-2" />
                        {language === "en" ? "हिं" : "EN"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
