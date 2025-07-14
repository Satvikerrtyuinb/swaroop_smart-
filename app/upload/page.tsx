"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/hooks/use-toast"
import { Upload, Download, FileSpreadsheet, Database, CheckCircle, AlertCircle, FileText } from "lucide-react"
import { generateCSV } from "@/data/sample-returns"

interface UploadResult {
  success: boolean
  processed: number
  errors: number
  warnings: string[]
}

export default function UploadPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file",
        variant: "destructive",
      })
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be under 50MB",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
    setIsUploading(true)

    setTimeout(() => {
      const recordCount = Math.floor(Math.random() * 200) + 100
      const errorCount = Math.floor(recordCount * 0.05)

      const mockResult: UploadResult = {
        success: errorCount < recordCount * 0.1,
        processed: recordCount - errorCount,
        errors: errorCount,
        warnings: [
          `${errorCount} records had validation errors`,
          "3 SKUs not found in product catalog",
          "Invalid date format in 2 records",
          "Missing location data in 1 record",
        ].slice(0, errorCount > 0 ? 4 : 1),
      }

      setUploadResult(mockResult)
      setIsUploading(false)

      toast({
        title: mockResult.success ? "Upload Successful" : "Upload Completed with Errors",
        description: `Processed ${mockResult.processed} records${mockResult.errors > 0 ? ` with ${mockResult.errors} errors` : ""}`,
        variant: mockResult.success ? "default" : "destructive",
      })
    }, 3000)
  }

  const downloadTemplate = () => {
    const csvContent = [
      "SKU,Product Name,Category,Condition,Return Reason,Location,Return Date,Est. Value (₹),CO₂ Saved (kg),Landfill Avoided (kg),Recommended Action",
      'ELX123,"Bluetooth Earbuds",Electronics,"Lightly Used","Didn\'t like sound",Pune,2025-06-10,900,0.8,0.15,Reuse',
      'APP456,"Cotton Kurti",Clothing,New,"Wrong size",Jaipur,2025-06-14,500,0.5,0.25,Reuse',
      'HMA789,"Mixer Grinder",Appliances,Defective,"Motor issue",Chennai,2025-06-15,0,1.5,2.0,Recycle',
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "returns_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Template Downloaded",
      description: "CSV template downloaded successfully",
    })
  }

  const exportData = (format: "csv" | "pdf") => {
    if (format === "csv") {
      const csvContent = generateCSV()
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "smartreturns_dataset.csv"
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Dataset Exported",
        description: "Complete dataset exported successfully",
      })
    } else {
      toast({
        title: "PDF Export",
        description: "PDF report generation started",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Data Management</h1>
        <p className="text-gray-600">Upload bulk returns data or export ESG metrics and reports</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Returns Data
                </CardTitle>
                <CardDescription>Upload CSV file with bulk return information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Select CSV File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </div>

                {selectedFile && (
                  <div className="p-3 bg-gray-50 rounded border">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Size: {(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                )}

                {isUploading && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span>Processing file...</span>
                  </div>
                )}

                <Button onClick={downloadTemplate} variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </CardContent>
            </Card>

            {/* Upload Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Upload Results
                </CardTitle>
                <CardDescription>Processing status and validation results</CardDescription>
              </CardHeader>
              <CardContent>
                {uploadResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {uploadResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-medium">
                        {uploadResult.success ? "Upload Successful" : "Upload Failed"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Records Processed</p>
                        <p className="text-lg font-bold text-green-600">{uploadResult.processed}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Errors</p>
                        <p className="text-lg font-bold text-red-600">{uploadResult.errors}</p>
                      </div>
                    </div>

                    {uploadResult.warnings.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Warnings:</p>
                        <div className="space-y-1">
                          {uploadResult.warnings.map((warning, index) => (
                            <p
                              key={index}
                              className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-200"
                            >
                              {warning}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No upload results yet</p>
                    <p className="text-sm text-gray-400">Upload a CSV file to see processing results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* File Format Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>File Format Guidelines</CardTitle>
              <CardDescription>Required columns and data format specifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Required Columns</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• SKU (Product identifier)</li>
                    <li>• Product Name</li>
                    <li>• Condition (Good/Fair/Poor)</li>
                    <li>• Reason (Return reason)</li>
                    <li>• Location (City, State)</li>
                    <li>• Date (YYYY-MM-DD format)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Data Validation</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Maximum 10,000 records per file</li>
                    <li>• File size limit: 50MB</li>
                    <li>• UTF-8 encoding required</li>
                    <li>• Date format: YYYY-MM-DD</li>
                    <li>• SKU must exist in product catalog</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* ESG Metrics Export */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  ESG Metrics Export
                </CardTitle>
                <CardDescription>Export sustainability metrics and KPIs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Available Metrics</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• CO₂ emissions saved</li>
                    <li>• Landfill waste avoided</li>
                    <li>• Value recovered by category</li>
                    <li>• Return disposition breakdown</li>
                    <li>• Monthly trend analysis</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => exportData("csv")} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button onClick={() => exportData("pdf")} variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Department Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Department Reports
                </CardTitle>
                <CardDescription>Generate reports by department or category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Select Department</Label>
                  <select className="w-full p-2 border rounded">
                    <option>Electronics</option>
                    <option>Clothing & Accessories</option>
                    <option>Home & Appliances</option>
                    <option>Sports & Outdoors</option>
                    <option>All Departments</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">Time Period</Label>
                  <select className="w-full p-2 border rounded">
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                    <option>Custom range</option>
                  </select>
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Report Generation Started",
                      description: "Your custom report is being generated",
                    })

                    setTimeout(() => {
                      toast({
                        title: "Report Ready",
                        description: "Your department report has been generated successfully",
                      })
                    }, 3000)
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Exports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Exports</CardTitle>
              <CardDescription>Download history and generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "ESG_Metrics_2024_Q1.csv", date: "2024-01-20", size: "2.3 MB", type: "csv" },
                  { name: "Electronics_Returns_Report.pdf", date: "2024-01-18", size: "1.8 MB", type: "pdf" },
                  { name: "Monthly_Sustainability_Report.pdf", date: "2024-01-15", size: "3.1 MB", type: "pdf" },
                ].map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {file.type === "csv" ? (
                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {file.date} • {file.size}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Download Started",
                          description: `${file.name} is being downloaded`,
                        })
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
