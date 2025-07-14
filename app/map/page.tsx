"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  Wrench,
  XCircle,
  MapPin,
  Users,
  TrendingUp,
  Leaf,
  Package,
  AlertTriangle,
  Calendar,
  Activity,
} from "lucide-react"

interface ProcessingHub {
  id: string
  name: string
  city: string
  state: string
  coordinates: [number, number]
  capacity: number
  utilization: number
  specialization: string[]
  status: "active" | "maintenance" | "offline"
  itemsProcessed: number
  efficiency: number
  avgProcessingTime: number
  co2Saved: number
  image: string
  workers: number
  maxWorkers: number
  operatingHours: string
  lastUpdated: Date
  monthlyTarget: number
  revenue: number
  topCategories: { name: string; percentage: number }[]
  recentAlerts: string[]
  nextMaintenance: Date
  establishedDate: Date
  totalItemsLifetime: number
  certifications: string[]
}

const hubs: ProcessingHub[] = [
  {
    id: "hub-mumbai-1",
    name: "Mumbai Central Hub",
    city: "Mumbai",
    state: "Maharashtra",
    coordinates: [19.076, 72.8777],
    capacity: 5000,
    utilization: 85,
    specialization: ["Electronics", "Appliances", "Fashion", "Home & Kitchen"],
    status: "active",
    itemsProcessed: 12847,
    efficiency: 94,
    avgProcessingTime: 3.2,
    co2Saved: 245.7,
    image: "/images/mumbai-hub.png",
    workers: 48,
    maxWorkers: 60,
    operatingHours: "24/7",
    lastUpdated: new Date(Date.now() - 2 * 60 * 1000),
    monthlyTarget: 15000,
    revenue: 2847500,
    topCategories: [
      { name: "Electronics", percentage: 45 },
      { name: "Fashion", percentage: 30 },
      { name: "Appliances", percentage: 25 },
    ],
    recentAlerts: ["High volume alert", "Efficiency target met"],
    nextMaintenance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    establishedDate: new Date("2022-03-15"),
    totalItemsLifetime: 156789,
    certifications: ["ISO 14001", "OHSAS 18001", "Green Building"],
  },
  {
    id: "hub-bangalore-1",
    name: "Bangalore Tech Hub",
    city: "Bangalore",
    state: "Karnataka",
    coordinates: [12.9716, 77.5946],
    capacity: 3500,
    utilization: 72,
    specialization: ["Electronics", "Tech Accessories", "Mobile Devices"],
    status: "maintenance",
    itemsProcessed: 8934,
    efficiency: 91,
    avgProcessingTime: 2.8,
    co2Saved: 189.3,
    image: "/images/bangalore-hub.png",
    workers: 32,
    maxWorkers: 50,
    operatingHours: "06:00 – 23:00",
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000),
    monthlyTarget: 12000,
    revenue: 1876200,
    topCategories: [
      { name: "Electronics", percentage: 65 },
      { name: "Tech Accessories", percentage: 25 },
      { name: "Mobile Devices", percentage: 10 },
    ],
    recentAlerts: ["Scheduled maintenance in progress"],
    nextMaintenance: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    establishedDate: new Date("2022-07-20"),
    totalItemsLifetime: 98456,
    certifications: ["ISO 9001", "ISO 14001", "Tech Hub Certified"],
  },
  {
    id: "hub-delhi-1",
    name: "Delhi Processing Center",
    city: "Delhi",
    state: "Delhi",
    coordinates: [28.7041, 77.1025],
    capacity: 4200,
    utilization: 78,
    specialization: ["Fashion", "Textiles", "Accessories", "Home Decor"],
    status: "active",
    itemsProcessed: 10567,
    efficiency: 89,
    avgProcessingTime: 3.5,
    co2Saved: 198.4,
    image: "/images/delhi-hub.png",
    workers: 42,
    maxWorkers: 55,
    operatingHours: "05:00 – 22:00",
    lastUpdated: new Date(Date.now() - 5 * 60 * 1000),
    monthlyTarget: 13500,
    revenue: 2134800,
    topCategories: [
      { name: "Fashion", percentage: 50 },
      { name: "Textiles", percentage: 30 },
      { name: "Accessories", percentage: 20 },
    ],
    recentAlerts: ["Peak season preparation", "New worker training completed"],
    nextMaintenance: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    establishedDate: new Date("2021-11-10"),
    totalItemsLifetime: 187234,
    certifications: ["ISO 14001", "Fair Trade", "Textile Recycling Certified"],
  },
  {
    id: "hub-hyderabad-1",
    name: "Hyderabad Smart Hub",
    city: "Hyderabad",
    state: "Telangana",
    coordinates: [17.385, 78.4867],
    capacity: 3800,
    utilization: 82,
    specialization: ["Electronics", "IT Equipment", "Gaming", "Smart Devices"],
    status: "active",
    itemsProcessed: 9876,
    efficiency: 96,
    avgProcessingTime: 2.9,
    co2Saved: 167.8,
    image: "/images/ai-processing.png",
    workers: 38,
    maxWorkers: 48,
    operatingHours: "24/7",
    lastUpdated: new Date(Date.now() - 8 * 60 * 1000),
    monthlyTarget: 12000,
    revenue: 1987600,
    topCategories: [
      { name: "Electronics", percentage: 55 },
      { name: "IT Equipment", percentage: 25 },
      { name: "Gaming", percentage: 20 },
    ],
    recentAlerts: ["AI system upgrade completed", "Efficiency record achieved"],
    nextMaintenance: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    establishedDate: new Date("2022-09-05"),
    totalItemsLifetime: 76543,
    certifications: ["ISO 9001", "Smart City Certified", "AI Processing Certified"],
  },
  {
    id: "hub-chennai-1",
    name: "Chennai Coastal Hub",
    city: "Chennai",
    state: "Tamil Nadu",
    coordinates: [13.0827, 80.2707],
    capacity: 3200,
    utilization: 68,
    specialization: ["Appliances", "Automotive Parts", "Industrial Equipment"],
    status: "active",
    itemsProcessed: 7234,
    efficiency: 87,
    avgProcessingTime: 4.1,
    co2Saved: 156.2,
    image: "/images/processing-workflow.png",
    workers: 35,
    maxWorkers: 45,
    operatingHours: "06:00 – 22:00",
    lastUpdated: new Date(Date.now() - 12 * 60 * 1000),
    monthlyTarget: 10500,
    revenue: 1456700,
    topCategories: [
      { name: "Appliances", percentage: 60 },
      { name: "Automotive", percentage: 25 },
      { name: "Industrial", percentage: 15 },
    ],
    recentAlerts: ["Monsoon preparation complete", "New sorting equipment installed"],
    nextMaintenance: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    establishedDate: new Date("2022-01-18"),
    totalItemsLifetime: 89765,
    certifications: ["ISO 14001", "Coastal Processing Certified", "Automotive Parts Certified"],
  },
  {
    id: "hub-kolkata-1",
    name: "Kolkata Heritage Hub",
    city: "Kolkata",
    state: "West Bengal",
    coordinates: [22.5726, 88.3639],
    capacity: 2800,
    utilization: 75,
    specialization: ["Textiles", "Handicrafts", "Books", "Vintage Items"],
    status: "offline",
    itemsProcessed: 6543,
    efficiency: 83,
    avgProcessingTime: 3.8,
    co2Saved: 134.5,
    image: "/images/circular-economy.png",
    workers: 28,
    maxWorkers: 40,
    operatingHours: "07:00 – 20:00",
    lastUpdated: new Date(Date.now() - 45 * 60 * 1000),
    monthlyTarget: 9000,
    revenue: 1234500,
    topCategories: [
      { name: "Textiles", percentage: 45 },
      { name: "Handicrafts", percentage: 35 },
      { name: "Books", percentage: 20 },
    ],
    recentAlerts: ["Power outage - temporary shutdown", "Backup systems activated"],
    nextMaintenance: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    establishedDate: new Date("2021-08-25"),
    totalItemsLifetime: 67890,
    certifications: ["Heritage Preservation", "Textile Recycling", "Cultural Items Certified"],
  },
]

export default function HubNetworkPage() {
  const { toast } = useToast()

  const [selectedHub, setSelectedHub] = useState<ProcessingHub | null>(null)
  const [mapView, setMapView] = useState<"overview" | "performance" | "logistics">("overview")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "maintenance" | "offline">("all")

  const filtered = hubs.filter((h) => filterStatus === "all" || h.status === filterStatus)

  const statusIcon = {
    active: <CheckCircle className="h-4 w-4 text-green-600" aria-hidden />,
    maintenance: <Wrench className="h-4 w-4 text-yellow-600" aria-hidden />,
    offline: <XCircle className="h-4 w-4 text-red-600" aria-hidden />,
  }

  const statusColor = {
    active: "bg-green-100 text-green-800 border-green-200",
    maintenance: "bg-yellow-100 text-yellow-800 border-yellow-200",
    offline: "bg-red-100 text-red-800 border-red-200",
  }

  const handleSelect = (hub: ProcessingHub) => {
    setSelectedHub(hub)
    toast({
      title: `Selected ${hub.name}`,
      description: `${hub.city}, ${hub.state} | Capacity ${hub.capacity} | Utilization ${hub.utilization}%`,
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60))
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Hub Network</h1>
          <p className="text-muted-foreground">Manage and monitor processing hubs across India</p>
        </div>

        {/* View Tabs */}
        <Tabs value={mapView} onValueChange={(v) => setMapView(v as typeof mapView)}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="logistics">Logistics</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Status Filter */}
        <div className="flex gap-2">
          {(["all", "active", "maintenance", "offline"] as const).map((st) => (
            <Button
              key={st}
              size="sm"
              variant={filterStatus === st ? "default" : "outline"}
              onClick={() => setFilterStatus(st)}
            >
              {st[0].toUpperCase() + st.slice(1)}
              <Badge variant="secondary" className="ml-2">
                {st === "all" ? hubs.length : hubs.filter((h) => h.status === st).length}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Network Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Items Processed</p>
                <p className="text-2xl font-bold">
                  {hubs.reduce((sum, hub) => sum + hub.itemsProcessed, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                <p className="text-2xl font-bold">{hubs.reduce((sum, hub) => sum + hub.co2Saved, 0).toFixed(1)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Workers</p>
                <p className="text-2xl font-bold">{hubs.reduce((sum, hub) => sum + hub.workers, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(hubs.reduce((sum, hub) => sum + hub.revenue, 0))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hubs List */}
        <div className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((hub) => (
              <Card
                key={hub.id}
                onClick={() => handleSelect(hub)}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedHub?.id === hub.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardHeader className="relative p-0">
                  <img
                    src={hub.image || "/placeholder.svg"}
                    alt={`${hub.name} facility`}
                    className="h-32 w-full rounded-t-md object-cover"
                  />
                  <Badge className={`absolute right-2 top-2 flex items-center gap-1 ${statusColor[hub.status]}`}>
                    {statusIcon[hub.status]}
                    <span className="capitalize">{hub.status}</span>
                  </Badge>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
                    <MapPin className="h-3 w-3" />
                    {hub.city}, {hub.state}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  <div>
                    <CardTitle className="text-lg">{hub.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Last updated: {getTimeAgo(hub.lastUpdated)}</p>
                  </div>

                  {mapView === "overview" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Utilization</span>
                        <span className="font-medium">{hub.utilization}%</span>
                      </div>
                      <Progress value={hub.utilization} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Workers</span>
                        <span>
                          {hub.workers}/{hub.maxWorkers}
                        </span>
                      </div>
                    </div>
                  )}

                  {mapView === "performance" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Efficiency</span>
                        <span className="font-medium">{hub.efficiency}%</span>
                      </div>
                      <Progress value={hub.efficiency} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Avg. Processing</span>
                        <span>{hub.avgProcessingTime}h</span>
                      </div>
                    </div>
                  )}

                  {mapView === "logistics" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Items Processed</span>
                        <span className="font-medium">{hub.itemsProcessed.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>CO₂ Saved</span>
                        <span className="font-medium">{hub.co2Saved} kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Revenue</span>
                        <span className="font-medium">{formatCurrency(hub.revenue)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {hub.specialization.slice(0, 2).map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {hub.specialization.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{hub.specialization.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Hub Information */}
        <div className="space-y-4">
          {selectedHub ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {selectedHub.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {selectedHub.city}, {selectedHub.state}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Established</p>
                      <p className="font-medium">{formatDate(selectedHub.establishedDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-medium">{selectedHub.capacity.toLocaleString()} items/month</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Operating Hours</p>
                      <p className="font-medium">{selectedHub.operatingHours}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Monthly Progress</p>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Target: {selectedHub.monthlyTarget.toLocaleString()}</span>
                      <span>Current: {selectedHub.itemsProcessed.toLocaleString()}</span>
                    </div>
                    <Progress value={(selectedHub.itemsProcessed / selectedHub.monthlyTarget) * 100} className="h-2" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Top Categories</p>
                    <div className="space-y-2">
                      {selectedHub.topCategories.map((category) => (
                        <div key={category.name} className="flex justify-between text-sm">
                          <span>{category.name}</span>
                          <span className="font-medium">{category.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedHub.recentAlerts.map((alert, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span>{alert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Maintenance Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Next Maintenance</p>
                    <p className="font-medium">{formatDate(selectedHub.nextMaintenance)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedHub.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a hub to view detailed information</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
