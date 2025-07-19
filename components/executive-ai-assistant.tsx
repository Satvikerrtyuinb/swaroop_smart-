"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  Brain,
  Send,
  Mic,
  MicOff,
  Download,
  BarChart3,
  FileText,
  AlertTriangle,
  TrendingUp,
  Volume2,
  VolumeX,
  Sparkles,
  MessageSquare,
  Zap,
} from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  hasChart?: boolean
  chartData?: any[]
  chartType?: "line" | "bar" | "pie"
  hasReport?: boolean
  reportType?: "executive" | "esg" | "risk" | "benchmark"
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: any
  action: () => void
  color: string
}

export function ExecutiveAIAssistant() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hello! I'm your Executive AI Assistant. Ask me anything about your returns data, sustainability metrics, or business insights. Try asking: 'What's the resale trend for electronics?' or 'Generate an ESG impact report'.",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
        toast({
          title: "Speech Recognition Error",
          description: "Could not process voice input. Please try again.",
          variant: "destructive",
        })
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [toast])

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      recognitionRef.current.start()
    } else {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive",
      })
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const speakResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const generateMockResponse = (query: string): ChatMessage => {
    const lowerQuery = query.toLowerCase()
    
    // Mock responses with different chart types and data
    if (lowerQuery.includes("resale trend") || lowerQuery.includes("electronics")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content: "Based on the data analysis, electronics show a strong resale trend with 68% value recovery rate. The trend has been consistently improving over the past 6 months, with smartphones and laptops leading the category.",
        timestamp: new Date(),
        hasChart: true,
        chartType: "line",
        chartData: [
          { month: "Jan", value: 62 },
          { month: "Feb", value: 64 },
          { month: "Mar", value: 66 },
          { month: "Apr", value: 65 },
          { month: "May", value: 67 },
          { month: "Jun", value: 68 },
        ],
      }
    }

    if (lowerQuery.includes("hub") && lowerQuery.includes("underperform")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content: "Analysis shows that Kolkata Heritage Hub is currently underperforming with 75% utilization and offline status. Chennai Coastal Hub also shows lower efficiency at 87%. I recommend immediate attention to these facilities.",
        timestamp: new Date(),
        hasChart: true,
        chartType: "bar",
        chartData: [
          { hub: "Mumbai", efficiency: 94 },
          { hub: "Bangalore", efficiency: 91 },
          { hub: "Delhi", efficiency: 89 },
          { hub: "Hyderabad", efficiency: 96 },
          { hub: "Chennai", efficiency: 87 },
          { hub: "Kolkata", efficiency: 83 },
        ],
      }
    }

    if (lowerQuery.includes("esg") || lowerQuery.includes("sustainability")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content: "Your ESG performance is excellent! You've saved 1,247.8 kg of CO₂ emissions and diverted 892.4 kg from landfills. The circular economy score is 78%, exceeding industry benchmarks. Generating detailed ESG report...",
        timestamp: new Date(),
        hasReport: true,
        reportType: "esg",
        hasChart: true,
        chartType: "pie",
        chartData: [
          { name: "Resale", value: 68, color: "#10b981" },
          { name: "Repair", value: 17, color: "#f59e0b" },
          { name: "Recycle", value: 15, color: "#ef4444" },
        ],
      }
    }

    if (lowerQuery.includes("executive summary") || lowerQuery.includes("summary")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content: "Executive Summary: Returns processing is performing above targets with ₹2.1Cr value recovered this quarter. Key highlights: 94% processing efficiency, 68% resale rate, and 1,247kg CO₂ saved. Recommendation: Expand electronics processing capacity by 30% for Q4.",
        timestamp: new Date(),
        hasReport: true,
        reportType: "executive",
      }
    }

    if (lowerQuery.includes("risk") || lowerQuery.includes("alert")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content: "Risk Analysis: Medium risk detected in appliances category (85/100 risk score) due to high return rates. Electronics show manageable risk (75/100). Immediate action recommended for appliances quality control.",
        timestamp: new Date(),
        hasReport: true,
        reportType: "risk",
      }
    }

    if (lowerQuery.includes("benchmark") || lowerQuery.includes("amazon") || lowerQuery.includes("flipkart")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content: "Benchmark Analysis: Your 68% value recovery rate exceeds Amazon's 52% and matches Flipkart's performance. Processing time of 2.8 days is 40% faster than industry average. You're leading in sustainability metrics with 3.2kg CO₂ saved per item vs industry 1.8kg.",
        timestamp: new Date(),
        hasReport: true,
        reportType: "benchmark",
      }
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: "assistant",
      content: "I understand you're asking about returns data insights. Let me analyze the available data and provide you with relevant information. Could you be more specific about what metrics or timeframe you're interested in?",
      timestamp: new Date(),
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = generateMockResponse(inputValue)
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
      
      // Speak the response
      speakResponse(aiResponse.content)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const downloadReport = (reportType: string) => {
    const reportContent = {
      executive: "Executive Summary Report\n\nKey Metrics:\n- Total Returns: 1,247\n- Value Recovered: ₹2.1Cr\n- CO₂ Saved: 1,247.8kg\n- Processing Efficiency: 94%\n\nRecommendations:\n- Expand electronics capacity\n- Optimize hub utilization\n- Enhance sustainability programs",
      esg: "ESG Impact Report\n\nEnvironmental:\n- CO₂ Emissions Saved: 1,247.8kg\n- Waste Diverted: 892.4kg\n- Circular Economy Score: 78%\n\nSocial:\n- Jobs Created: 114\n- Community Impact: High\n\nGovernance:\n- Compliance Score: 96%\n- Transparency Index: 92%",
      risk: "Risk Assessment Report\n\nHigh Risk Areas:\n- Appliances Category (85/100)\n- Seasonal Demand Spikes\n\nMitigation Strategies:\n- Enhanced QC processes\n- Capacity planning\n- Supplier diversification",
      benchmark: "Benchmark Analysis Report\n\nVs Amazon:\n- Value Recovery: +16% better\n- Processing Time: +40% faster\n\nVs Flipkart:\n- Value Recovery: Equal\n- Sustainability: +78% better\n\nIndustry Position: Top 10%"
    }

    const content = reportContent[reportType as keyof typeof reportContent] || "Report content"
    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${reportType}_report_${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Report Downloaded",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been generated`,
    })
  }

  const quickActions: QuickAction[] = [
    {
      id: "executive",
      title: "Executive Summary",
      description: "Generate comprehensive overview",
      icon: FileText,
      color: "bg-blue-500",
      action: () => {
        setInputValue("Generate executive summary")
        handleSendMessage()
      },
    },
    {
      id: "esg",
      title: "ESG Impact Report",
      description: "Sustainability metrics analysis",
      icon: TrendingUp,
      color: "bg-green-500",
      action: () => {
        setInputValue("Generate ESG impact report")
        handleSendMessage()
      },
    },
    {
      id: "risk",
      title: "Risk Alerts",
      description: "Identify potential issues",
      icon: AlertTriangle,
      color: "bg-red-500",
      action: () => {
        setInputValue("Show risk alerts and analysis")
        handleSendMessage()
      },
    },
    {
      id: "benchmark",
      title: "Benchmark Analysis",
      description: "Compare vs Amazon/Flipkart",
      icon: BarChart3,
      color: "bg-purple-500",
      action: () => {
        setInputValue("Benchmark against Amazon and Flipkart")
        handleSendMessage()
      },
    },
  ]

  const renderChart = (message: ChatMessage) => {
    if (!message.hasChart || !message.chartData) return null

    const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

    switch (message.chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={message.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={message.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hub" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="efficiency" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={message.chartData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {message.chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          Executive AI Assistant
        </CardTitle>
        <CardDescription>
          Natural language querying with voice input and dynamic report generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              onClick={action.action}
              className="h-auto p-3 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-200 bg-white/80 hover:bg-white"
            >
              <div className={`p-2 rounded-lg ${action.color} text-white`}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="text-center">
                <p className="font-medium text-xs">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>

        {/* Chat Messages */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <ScrollArea className="h-96 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900 border"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.type === "assistant" && (
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-purple-600" />
                            <Badge variant="secondary" className="text-xs">AI Assistant</Badge>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      
                      {message.hasChart && (
                        <div className="mt-3 p-3 bg-white rounded border">
                          {renderChart(message)}
                        </div>
                      )}
                      
                      {message.hasReport && (
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadReport(message.reportType!)}
                            className="text-xs"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download Report
                          </Button>
                          {message.type === "assistant" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => isSpeaking ? stopSpeaking() : speakResponse(message.content)}
                              className="text-xs"
                            >
                              {isSpeaking ? <VolumeX className="h-3 w-3 mr-1" /> : <Volume2 className="h-3 w-3 mr-1" />}
                              {isSpeaking ? "Stop" : "Listen"}
                            </Button>
                          )}
                        </div>
                      )}
                      
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 border">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        <span className="text-sm text-gray-600">AI is analyzing your request...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Input Area */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about returns, sustainability, or business insights..."
              className="pr-12 bg-white/80 backdrop-blur-sm border-purple-200 focus:border-purple-400"
              disabled={isLoading}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={isListening ? stopListening : startListening}
              className={`absolute right-1 top-1 h-8 w-8 p-0 ${
                isListening ? "text-red-500 animate-pulse" : "text-gray-500"
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isListening ? "bg-red-500 animate-pulse" : "bg-gray-300"}`} />
              <span>Voice {isListening ? "Listening" : "Ready"}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-blue-500 animate-pulse" : "bg-gray-300"}`} />
              <span>Audio {isSpeaking ? "Playing" : "Ready"}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-purple-500" />
            <span>AI-Powered Analytics</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}