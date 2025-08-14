"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Search, Upload, Copy, Download, Check, Sun, Moon, ChevronDown, Github, Linkedin } from "lucide-react"
import * as Select from "@radix-ui/react-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"


export default function TechStackIcons() {
  const [techIconsState, setTechIconsState] = useState<Array<{ name: string; svg: string; category?: string }>>([])

  const [searchTerm, setSearchTerm] = useState("")
  // Load icons from /api/icons on mount
  useEffect(() => {
    fetch('/api/icons')
      .then((res) => res.json())
      .then((data) => setTechIconsState(data))
      .catch(() => {
        console.error('Failed to fetch icons')
      })
  }, [])
  const [customIcons, setCustomIcons] = useState<Array<{ name: string; svg: string }>>([])
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [iconStyle, setIconStyle] = useState<'none' | 'rect' | 'circle'>('none')
  const [iconTheme, setIconTheme] = useState<'transparent' | 'light' | 'dark'>('transparent')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const filteredIcons = [...techIconsState, ...customIcons].filter(
    (icon) =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ("category" in icon && typeof (icon as any).category === 'string' && (icon as any).category.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const copyToClipboard = useCallback(
    async (icon: { name: string; file?: string }) => {
      const fileName = icon.file ?? `${icon.name.toLowerCase().replace(/\s+|_/g, '-')}.svg`
      const base = (process.env.NEXT_PUBLIC_BASE_URL as string | undefined) ?? (typeof window !== 'undefined' ? window.location.origin : '')
      const url = `${base}/api/serve-icon?file=${encodeURIComponent(fileName)}&theme=${iconTheme}&style=${iconStyle}&size=64`;
      const imgTag = `<img src="${url}" width="64px" />`;
      try {
        await navigator.clipboard.writeText(imgTag)
        setCopiedIcon(icon.name)
        toast({
          title: "Copied!",
          description: `${icon.name} image tag copied to clipboard`,
        })
        setTimeout(() => setCopiedIcon(null), 2000)
      } catch (err) {
        toast({
          title: "Copy failed",
          description: "Please try again",
          variant: "destructive",
        })
      }
    },
    [toast, iconStyle, iconTheme],
  )

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (file.type !== "image/svg+xml" && !file.name.endsWith(".svg")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an SVG file",
          variant: "destructive",
        })
        return
      }

      if (file.size > 100000) {
        // 100KB limit
        toast({
          title: "File too large",
          description: "Please upload an SVG smaller than 100KB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const svgContent = e.target?.result as string
        const fileName = file.name.replace(".svg", "")

        setCustomIcons((prev) => [
          ...prev,
          {
            name: fileName,
            svg: svgContent,
          },
        ])

        toast({
          title: "Upload successful",
          description: `${fileName} has been added to your library`,
        })
      }
      reader.readAsText(file)
    },
    [toast, iconStyle, iconTheme],
  )

  const downloadIcon = (icon: { name: string; svg: string }) => {
    const blob = new Blob([icon.svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${icon.name}.svg`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const getThemeBgClass = () => {
    if (iconTheme === 'light') return 'bg-white'
    if (iconTheme === 'dark') return 'bg-[#1e2733]'
    return ''
  }

  const getShapeClass = () => {
    if (iconStyle === 'circle') return 'rounded-full overflow-hidden p-2 bg-gray-100 dark:bg-gray-700'
    if (iconStyle === 'rect') return 'rounded-[10px] overflow-hidden p-2'
    return ''
  }

  const getSizeClass = () => {
    return "w-12 h-12"
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-black/90 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <header className="w-full sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-[#0f1722]/70 border-b border-gray-200 dark:border-[#293241]">
        <div className="max-w-6xl mx-auto py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-xl font-semibold text-[#E63946]">
            <span className="bg-[#E63946] text-white w-8 h-8 rounded-md flex items-center justify-center font-bold">M</span>
            <span className="text-gray-800 dark:text-gray-100">MedIcons</span>
          </a>
          <nav className="flex items-center gap-6 text-base font-semibold text-gray-700 dark:text-gray-200">
            <a href="https://github.com/MED-007/MEDIcons" target="_blank" rel="noopener" className="flex items-center gap-1 hover:text-[#E63946]">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/mohamed-laaguidi-b03236207/" target="_blank" rel="noopener" className="flex items-center gap-1 hover:text-[#E63946]">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </nav>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Tech Stack <span className="text-[#E63946]">Icons</span>
          </h1>
          <p className="text-lg text-gray-400 dark:text-gray-400 max-w-2xl mx-auto">
            A modern, minimalist library of popular tech stack icons. Click any icon to copy its SVG code, or upload
            your own custom icons.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 border-gray-300 dark:border-white/10 focus:border-[#E63946] focus:ring-[#E63946] dark:bg-[#1e2733] ${isDarkMode ? "border-1 border-white/10":""}`}
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Size selector */}

            {/* Theme selector */}
            <label className="text-sm font-medium mr-2">Theme:</label>
            <Select.Root value={iconTheme} onValueChange={(v)=>setIconTheme(v as 'transparent'|'light'|'dark')}>
              <Select.Trigger className="inline-flex items-center justify-between px-3 py-1 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E63946] gap-2">
                <Select.Value className="text-sm font-medium" placeholder="Transparent" />
                <Select.Icon><ChevronDown className="w-4 h-4"/></Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content sideOffset={4} className="z-50 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <Select.Viewport className="p-1">
                    <Select.Item value="transparent" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700">
                      <Select.ItemText>Transparent</Select.ItemText>
                      <Select.ItemIndicator className="ml-auto"><Check className="w-4 h-4 text-[#E63946]"/></Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item value="light" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700">
                      <Select.ItemText>Light</Select.ItemText>
                      <Select.ItemIndicator className="ml-auto"><Check className="w-4 h-4 text-[#E63946]"/></Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item value="dark" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700">
                      <Select.ItemText>Dark</Select.ItemText>
                      <Select.ItemIndicator className="ml-auto"><Check className="w-4 h-4 text-[#E63946]"/></Select.ItemIndicator>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            {/* Style selector */}
            <label className="text-sm font-medium mr-2">Style:</label>
            <Select.Root value={iconStyle} onValueChange={(v)=>setIconStyle(v as 'none' | 'rect' | 'circle')}>
              <Select.Trigger className="inline-flex items-center justify-between px-3 py-1 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E63946] gap-2">
                <Select.Value className="text-sm font-medium" placeholder="None" />
                <Select.Icon><ChevronDown className="w-4 h-4"/></Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content sideOffset={4} className="z-50 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <Select.Viewport className="p-1">
                    <Select.Item value="none" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700">
                      <Select.ItemText>None</Select.ItemText>
                      <Select.ItemIndicator className="ml-auto"><Check className="w-4 h-4 text-[#E63946]"/></Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item value="rect" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700">
                      <Select.ItemText>Rectangle</Select.ItemText>
                      <Select.ItemIndicator className="ml-auto"><Check className="w-4 h-4 text-[#E63946]"/></Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item value="circle" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700">
                      <Select.ItemText>Circle</Select.ItemText>
                      <Select.ItemIndicator className="ml-auto"><Check className="w-4 h-4 text-[#E63946]"/></Select.ItemIndicator>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            {/* Upload button */}
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-[#E63946] text-[#E63946] hover:bg-[#E63946] hover:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload SVG
            </Button>

            {/* Dark mode toggle */}
            <Button
              onClick={() => setIsDarkMode(!isDarkMode)}
              variant="outline"
              size="icon"
              className="border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-black" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,image/svg+xml"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Icons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-5 gap-6">
          {filteredIcons.map((icon, index) => (
            <Card
              key={`${icon.name}-${index}`}
              className={`p-4 cursor-pointer icon-hover border-2 transition-all duration-200 ${
                copiedIcon === icon.name
                  ? "border-[#E63946] bg-[#E63946]/5 copy-success"
                  : "border-gray-200 hover:border-[#E63946]/50"
              } ${isDarkMode ? "bg-transparent border border-white/10" : "bg-white"}`}
              onClick={() => copyToClipboard(icon)}
            >
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`${getSizeClass()} ${getShapeClass()} ${getThemeBgClass()} text-gray-700 dark:text-gray-300 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full`}
                  dangerouslySetInnerHTML={{ __html: icon.svg }}
                />
                <div className="text-center">
                  <h3 className={`font-medium text-sm ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>{icon.name}</h3>
                  {"category" in icon && typeof (icon as any).category === 'string' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{(icon as any).category}</p>
                  )}
                </div>
                {/* Copy status dots */}
                <div className="flex items-center gap-5 mt-5">
                  <span
                    className={`w-3 h-3 rounded-full ${copiedIcon === icon.name ? 'bg-gradient-to-br from-green-400 via-green-500 to-green-600 shadow-lg shadow-green-500/60 animate-pulse' : 'bg-gray-500'}`}
                  />
                  <span
                    className={`w-3 h-3 rounded-full ${copiedIcon === icon.name ? 'bg-gray-500' : 'bg-gradient-to-br from-red-400 via-red-500 to-red-600 shadow-lg shadow-red-500/60 animate-pulse'}`}
                  />
                </div>
                <div className="flex items-center justify-center gap-2 w-full mt-2">
                  <Copy
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(icon) }}
                    className="w-4 h-4 text-gray-400 hover:text-[#E63946] cursor-pointer transition-colors"
                  />
                  <Download
                    onClick={(e) => { e.stopPropagation(); downloadIcon(icon) }}
                    className="w-4 h-4 text-gray-400 hover:text-[#E63946] cursor-pointer transition-colors"
                  />
                  
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No icons found matching "{searchTerm}"</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Try a different search term or upload your own SVG
            </p>
          </div>
        )}


      </div>
    </div>
  )
}
