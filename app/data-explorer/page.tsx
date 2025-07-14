"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { comprehensiveReturnsData } from "@/data/comprehensive-returns-dataset"
import { Search, Filter, ArrowUp, ArrowDown, Download, RefreshCw, Package, ListFilter } from "lucide-react"
import Image from "next/image"

const ITEMS_PER_PAGE = 10

export default function DataExplorerPage() {
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
            <Image src="/images/data-analytics.png" alt="Data Explorer" fill className="object-cover" />
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

      {/* Filters and Actions */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Filter & Search Returns
          </CardTitle>
          <CardDescription>Refine your data view by keywords, categories, and actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by product, SKU, reason, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
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
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="Resale">Resale</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
                <SelectItem value="Recycle">Recycle</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportData} disabled={isLoading} className="w-full md:w-auto">
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
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-0 shadow-xl">
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
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("productName")}>
                    Product
                    {sortColumn === "productName" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="inline-block h-3 w-3 ml-1" />
                      ) : (
                        <ArrowDown className="inline-block h-3 w-3 ml-1" />
                      ))}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                    Category
                    {sortColumn === "category" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="inline-block h-3 w-3 ml-1" />
                      ) : (
                        <ArrowDown className="inline-block h-3 w-3 ml-1" />
                      ))}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("condition")}>
                    Condition
                    {sortColumn === "condition" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="inline-block h-3 w-3 ml-1" />
                      ) : (
                        <ArrowDown className="inline-block h-3 w-3 ml-1" />
                      ))}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("returnReason")}>
                    Reason
                    {sortColumn === "returnReason" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="inline-block h-3 w-3 ml-1" />
                      ) : (
                        <ArrowDown className="inline-block h-3 w-3 ml-1" />
                      ))}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("location")}>
                    Location
                    {sortColumn === "location" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="inline-block h-3 w-3 ml-1" />
                      ) : (
                        <ArrowDown className="inline-block h-3 w-3 ml-1" />
                      ))}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("estValue")}>
                    Est. Value
                    {sortColumn === "estValue" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="inline-block h-3 w-3 ml-1" />
                      ) : (
                        <ArrowDown className="inline-block h-3 w-3 ml-1" />
                      ))}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("co2Saved")}>
                    CO₂ Saved
                    {sortColumn === "co2Saved" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="inline-block h-3 w-3 ml-1" />
                      ) : (
                        <ArrowDown className="inline-block h-3 w-3 ml-1" />
                      ))}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("recommendedAction")}>
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
                    <TableRow key={item.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100">
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
                          <p className="text-sm">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.sku}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.condition}</Badge>
                      </TableCell>
                      <TableCell>{item.returnReason}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell className="text-green-600 font-semibold">₹{item.estValue.toLocaleString()}</TableCell>
                      <TableCell className="text-purple-600 font-semibold">{item.co2Saved} kg</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.recommendedAction}</Badge>
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
    </div>
  )
}
