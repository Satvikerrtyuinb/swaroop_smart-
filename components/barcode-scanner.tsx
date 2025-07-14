"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X, Flashlight, FlashlightOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BarcodeScannerProps {
  onScan: (code: string) => void
  onClose: () => void
  isOpen: boolean
}

export function BarcodeScanner({ onScan, onClose, isOpen }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [hasFlash, setHasFlash] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => stopCamera()
  }, [isOpen])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)

        // Check if device has flash
        const track = mediaStream.getVideoTracks()[0]
        const capabilities = track.getCapabilities()
        setHasFlash("torch" in capabilities)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      // Fallback to manual entry
      simulateBarcodeScan()
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const toggleFlash = async () => {
    if (stream && hasFlash) {
      const track = stream.getVideoTracks()[0]
      try {
        await track.applyConstraints({
          advanced: [{ torch: !flashOn }],
        })
        setFlashOn(!flashOn)
      } catch (error) {
        console.error("Error toggling flash:", error)
      }
    }
  }

  // Simulate barcode scanning for demo
  const simulateBarcodeScan = () => {
    setIsScanning(true)

    // Simulate scanning delay
    setTimeout(() => {
      const mockBarcodes = ["MX-KT22-BLK", "BT-EB01-WHT", "NK-SH42-BLK", "SM-A54-BLU"]

      const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)]
      onScan(randomBarcode)
      setIsScanning(false)
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 p-4">
        <div className="flex items-center justify-between text-white">
          <h2 className="text-lg font-semibold">Scan Barcode</h2>
          <div className="flex items-center gap-2">
            {hasFlash && (
              <Button variant="ghost" size="sm" onClick={toggleFlash} className="text-white hover:bg-white/20">
                {flashOn ? <FlashlightOff className="h-5 w-5" /> : <Flashlight className="h-5 w-5" />}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Camera View */}
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

      <canvas ref={canvasRef} className="hidden" />

      {/* Scanning Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Scanning Frame */}
          <div className="w-64 h-64 border-2 border-white rounded-lg relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>

            {/* Scanning Line Animation */}
            {isScanning && (
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="w-full h-1 bg-green-400 animate-pulse absolute top-1/2 transform -translate-y-1/2"></div>
              </div>
            )}
          </div>

          <p className="text-white text-center mt-4">
            {isScanning ? "Scanning..." : "Position barcode within the frame"}
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <Card className="bg-black/50 border-white/20">
          <CardContent className="p-4">
            <Button
              onClick={simulateBarcodeScan}
              disabled={isScanning}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white"
            >
              {isScanning ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Scanning...
                </div>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Tap to Scan
                </>
              )}
            </Button>

            <p className="text-white/70 text-sm text-center mt-2">Or manually enter barcode number</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
