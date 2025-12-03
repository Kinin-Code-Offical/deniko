"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2, Crop, RotateCcw } from "lucide-react"

interface ImageCropperProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    file: File | null
    onCrop: (croppedFile: File) => void
}

export function ImageCropper({ open, onOpenChange, file, onCrop }: ImageCropperProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [zoom, setZoom] = useState(1)
    const [isCropping, setIsCropping] = useState(false)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file)
            setImageSrc(url)
            setZoom(1)
            setOffset({ x: 0, y: 0 })
            return () => URL.revokeObjectURL(url)
        }
    }, [file])

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setOffset({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            })
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleCrop = async () => {
        if (!imageRef.current || !canvasRef.current) return

        setIsCropping(true)
        try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            // Set output size (e.g., 400x400)
            const size = 400
            canvas.width = size
            canvas.height = size

            // Draw image
            // We need to calculate the source rectangle based on zoom and offset
            // The container is the viewport. The circle is in the center.
            // Let's assume the viewport is 300x300 (displayed size)

            const image = imageRef.current
            const scale = zoom

            // Draw the image transformed
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, size, size)

            // Save context
            ctx.save()

            // Clip to circle
            ctx.beginPath()
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
            ctx.clip()

            // Calculate draw position
            // The offset is in screen pixels relative to the center
            // We need to map that to the canvas size

            // Simplified approach: Draw image centered then translate/scale
            ctx.translate(size / 2 + offset.x, size / 2 + offset.y)
            ctx.scale(scale, scale)
            ctx.drawImage(image, -image.width / 2, -image.height / 2)

            ctx.restore()

            canvas.toBlob((blob) => {
                if (blob) {
                    const croppedFile = new File([blob], file?.name || "cropped.jpg", {
                        type: "image/jpeg",
                        lastModified: Date.now(),
                    })
                    onCrop(croppedFile)
                    onOpenChange(false)
                }
                setIsCropping(false)
            }, "image/jpeg", 0.9)

        } catch (error) {
            console.error("Crop failed", error)
            setIsCropping(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Photo</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center gap-4 py-4">
                    <div
                        ref={containerRef}
                        className="relative h-[300px] w-[300px] overflow-hidden rounded-full border-4 border-primary/20 cursor-move bg-black/5"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        {imageSrc && (
                            <img
                                ref={imageRef}
                                src={imageSrc}
                                alt="Crop preview"
                                className="absolute max-w-none origin-center select-none pointer-events-none"
                                style={{
                                    transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                                    left: "50%",
                                    top: "50%"
                                }}
                                draggable={false}
                            />
                        )}
                    </div>

                    <div className="w-full px-4 space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Zoom</span>
                            <span>{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min={0.5}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button variant="ghost" onClick={() => {
                        setZoom(1)
                        setOffset({ x: 0, y: 0 })
                    }}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    <Button onClick={handleCrop} disabled={isCropping}>
                        {isCropping && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <Crop className="w-4 h-4 mr-2" />
                        Crop & Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
