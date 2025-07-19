"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { comprehensiveReturnsData } from "@/data/comprehensive-returns-dataset"
import { Search, Filter, ArrowUp, ArrowDown, Download, RefreshCw, Package, ListFilter, BarChart3, Database, Eye } from "lucide-react"
import { TrendingUp } from "lucide-react"
import Image from "next/image"

const ITEMS_PER_PAGE = 10

export default function DataExplorerPage() {
  const [activeView, setActiveView] = useState("table")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterAction, setFilterAction] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isLoading, setIsLoading] = useState(false)

  const filteredAndSortedData = useMemo(() => {
    let filteredData = comprehensiveReturnsData.filter((item) => {
      const matchesSearch = searchTerm
        ? Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
        : true
      const matchesCategory = filterCategory === "all" ? true : item.category === filterCategory
      const matchesAction = filterAction === "all" ? true : item.recommendedAction === filterAction
      return matchesSearch && matchesCategory && matchesAction
    })

    if (sortColumn) {
      filteredData = filteredData.sort((a, b) => {
        const aValue = (a as any)[sortColumn]
        const bValue = (b as any)[sortColumn]

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      })
    }

    return filteredData
  }, [searchTerm, filterCategory, filterAction, sortColumn, sortDirection])

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredAndSortedData.slice(startIndex, endIndex)
  }, [currentPage, filteredAndSortedData])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const exportData = () => {
    setIsLoading(true)
    setTimeout(() => {
      const headers = [
        "ID",
        "SKU",
        "Product Name",
        "Brand",
        "Category",
        "Condition",
        "Return Reason",
        "Location",
        "Est. Value (₹)",
        "CO₂ Saved (kg)",
        "Recommended Action",
      ]

      const csvContent = [
        headers.join(","),
        ...filteredAndSortedData.map((item) =>
          [
            item.id,
            item.sku,
            `"${item.productName}"`,
            item.brand,
            item.category,
            `"${item.condition}"`,
            `"${item.returnReason}"`,
            item.location,
            item.estValue,
            item.co2Saved,
            item.recommendedAction,
          ].join(","),
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `smartreturns_data_explorer_${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Hero Section */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 via-green-50 to-blue-50 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-48 md:h-64">
            <Image 
              src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg" 
              alt="Data Analytics Dashboard" 
              fill 
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-green-900/80 flex items-center">
              <div className="p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Comprehensive Data Explorer</h2>
                <p className="text-lg opacity-90">
                  Deep dive into your returns data with powerful filtering and sorting
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <ListFilter className="h-3 w-3 mr-1" />
                    Advanced Filters
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Download className="h-3 w-3 mr-1" />
                    Exportable Data
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tab Interface */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Data Explorer
          </CardTitle>
          <CardDescription>Comprehensive data analysis and exploration tools</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gradient-to-r from-blue-50 to-green-50 p-1 rounded-xl">
              <TabsTrigger 
                value="table" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200 rounded-lg font-medium"
              >
                <Database className="h-4 w-4 mr-2" />
                Data Table
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-600 transition-all duration-200 rounded-lg font-medium"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 transition-all duration-200 rounded-lg font-medium"
              >
                <Eye className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
            </TabsList>

            {/* Filters and Actions */}
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by product, SKU, reason, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white border-gray-200 focus:border-blue-400"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full md:w-[180px] bg-white border-gray-200">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-full md:w-[180px] bg-white border-gray-200">
                    <SelectValue placeholder="Filter by Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="Resale">Resale</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Recycle">Recycle</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={exportData} disabled={isLoading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </>
                  )}
                </Button>
              </div>
            </div>

            <TabsContent value="table" className="space-y-6">
              {/* Data Table */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Returns Data Table
                  </CardTitle>
                  <CardDescription>Detailed view of all processed returns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("productName")}>
                            Product
                            {sortColumn === "productName" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="inline-block h-3 w-3 ml-1" />
                              ) : (
                                <ArrowDown className="inline-block h-3 w-3 ml-1" />
                              ))}
                          </TableHead>
                          <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("category")}>
                            Category
                            {sortColumn === "category" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="inline-block h-3 w-3 ml-1" />
                              ) : (
                                <ArrowDown className="inline-block h-3 w-3 ml-1" />
                              ))}
                          </TableHead>
                          <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("condition")}>
                            Condition
                            {sortColumn === "condition" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="inline-block h-3 w-3 ml-1" />
                              ) : (
                                <ArrowDown className="inline-block h-3 w-3 ml-1" />
                              ))}
                          </TableHead>
                          <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("returnReason")}>
                            Reason
                            {sortColumn === "returnReason" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="inline-block h-3 w-3 ml-1" />
                              ) : (
                                <ArrowDown className="inline-block h-3 w-3 ml-1" />
                              ))}
                          </TableHead>
                          <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("location")}>
                            Location
                            {sortColumn === "location" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="inline-block h-3 w-3 ml-1" />
                              ) : (
                                <ArrowDown className="inline-block h-3 w-3 ml-1" />
                              ))}
                          </TableHead>
                          <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("estValue")}>
                            Est. Value
                            {sortColumn === "estValue" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="inline-block h-3 w-3 ml-1" />
                              ) : (
                                <ArrowDown className="inline-block h-3 w-3 ml-1" />
                              ))}
                          </TableHead>
                          <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("co2Saved")}>
                            CO₂ Saved
                            {sortColumn === "co2Saved" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="inline-block h-3 w-3 ml-1" />
                              ) : (
                                <ArrowDown className="inline-block h-3 w-3 ml-1" />
                              ))}
                          </TableHead>
                          <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("recommendedAction")}>
                            Action
                            {sortColumn === "recommendedAction" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="inline-block h-3 w-3 ml-1" />
                              ) : (
                                <ArrowDown className="inline-block h-3 w-3 ml-1" />
                              ))}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.length > 0 ? (
                          paginatedData.map((item) => (
                            <TableRow key={item.id} className="hover:bg-blue-50 transition-colors">
                              <TableCell className="font-medium flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                                  <Image
                                    src={
                                      item.category === "Electronics"
                                        ? item.productName.toLowerCase().includes("phone")
                                          ? "/images/xiaomi-phone.png"
                                          : item.productName.toLowerCase().includes("tv")
                                            ? "/images/samsung-tv.png"
                                            : "/images/boat-headphones.png"
                                        : item.category === "Fashion"
                                          ? "/images/fashion-category.png"
                                          : "/images/home-kitchen-category.png"
                                    }
                                    alt={item.productName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{item.productName}</p>
                                  <p className="text-xs text-muted-foreground">{item.sku}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {item.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  {item.condition}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-[150px] truncate">{item.returnReason}</TableCell>
                              <TableCell>{item.location}</TableCell>
                              <TableCell className="text-green-600 font-semibold">₹{item.estValue.toLocaleString()}</TableCell>
                              <TableCell className="text-purple-600 font-semibold">{item.co2Saved} kg</TableCell>
                              <TableCell>
                                <Badge 
                                        ? "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg"
                                  className={
                                          ? "https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg"
                                          : "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg"
                                      : item.recommendedAction === "Repair"
                                        ? "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg"
                                        : "https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg"
                                  }
                                >
                                  {item.recommendedAction}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                              No data found matching your criteria.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          aria-disabled={currentPage === 1}
                          tabIndex={currentPage === 1 ? -1 : undefined}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <Button variant={page === currentPage ? "default" : "outline"} onClick={() => setCurrentPage(page)}>
                            {page}
                          </Button>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          aria-disabled={currentPage === totalPages}
                          tabIndex={currentPage === totalPages ? -1 : undefined}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Category Performance</CardTitle>
                    <CardDescription>Returns distribution by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Electronics</span>
                          <span className="text-blue-600 font-bold">45%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Fashion</span>
                          <span className="text-green-600 font-bold">35%</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                        </div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Home & Kitchen</span>
                          <span className="text-purple-600 font-bold">20%</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Value Recovery</CardTitle>
                    <CardDescription>Financial impact analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600 mb-1">₹{(filteredAndSortedData.reduce((sum, item) => sum + item.estValue, 0) / 100000).toFixed(1)}L</div>
                        <p className="text-sm text-gray-600">Total Value Recovered</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-1">{filteredAndSortedData.length}</div>
                        <p className="text-sm text-gray-600">Items Processed</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600 mb-1">{filteredAndSortedData.reduce((sum, item) => sum + item.co2Saved, 0).toFixed(1)} kg</div>
                        <p className="text-sm text-gray-600">CO₂ Saved</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      Key Insights
                    </CardTitle>
                    <CardDescription>AI-generated insights from your data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">Peak Return Period</h4>
                        <p className="text-sm text-gray-600">Returns spike 40% during festival seasons</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">Top Performing Category</h4>
                        <p className="text-sm text-gray-600">Electronics show highest value recovery rate at 68%</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-2">Sustainability Leader</h4>
                        <p className="text-sm text-gray-600">Fashion category leads in CO₂ savings per item</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Recommendations
                    </CardTitle>
                    <CardDescription>Data-driven optimization suggestions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-2">Inventory Optimization</h4>
                        <p className="text-sm text-gray-600">Focus on high-value electronics for better ROI</p>
                        <Badge className="mt-2 bg-orange-100 text-orange-800">High Impact</Badge>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">Process Improvement</h4>
                        <p className="text-sm text-gray-600">Reduce processing time for fashion items by 25%</p>
                        <Badge className="mt-2 bg-blue-100 text-blue-800">Medium Impact</Badge>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">Sustainability Focus</h4>
                        <p className="text-sm text-gray-600">Expand repair programs for appliances</p>
                        <Badge className="mt-2 bg-green-100 text-green-800">Strategic</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
