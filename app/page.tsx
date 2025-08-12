"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Search, Upload, Copy, Download, Check, Sun, Moon, ChevronDown, Github, Linkedin } from "lucide-react"
import * as Select from "@radix-ui/react-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

// Tech stack icons data
const techIcons = [
  {
    name: "React",
    category: "Frontend",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 10.11c1.03 0 1.87.84 1.87 1.89s-.84 1.89-1.87 1.89-1.87-.84-1.87-1.89.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.37 1.95-1.47-.84-1.63-3.05-1.01-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1.01-5.63 1.46-.84 3.45.12 5.37 1.95 1.92-1.83 3.91-2.79 5.37-1.95z" fill="currentColor"/></svg>`,
  },
  {
    name: "Node.js",
    category: "Backend",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l7.44 4.3c.46.26 1.04.26 1.5 0l7.44-4.3c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.51-.2-.78-.2zm0 1.79c.1 0 .2.02.28.07l6.15 3.55c.16.09.26.26.26.45v7.58c0 .19-.1.36-.26.45l-6.15 3.55c-.16.09-.4.09-.56 0l-6.15-3.55c-.16-.09-.26-.26-.26-.45V7.71c0-.19.1-.36.26-.45l6.15-3.55c.08-.05.18-.07.28-.07z" fill="currentColor"/></svg>`,
  },
  {
    name: "Python",
    category: "Backend",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.26-.02.21-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25c-.2 0-.37.09-.5.27-.12.18-.18.39-.18.6 0 .2.06.37.18.49.13.12.3.18.5.18.2 0 .37-.06.5-.18.12-.12.18-.29.18-.49 0-.21-.06-.42-.18-.6-.13-.18-.3-.27-.5-.27z" fill="currentColor"/></svg>`,
  },
  {
    name: "Docker",
    category: "DevOps",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983 0 1.944-.09 2.86-.266a12.248 12.248 0 003.255-1.138c.971-.5 1.847-1.18 2.604-2.023 1.271-1.416 2.086-3.02 2.456-4.851h.04c1.06 0 1.716-.327 2.175-.698.3-.243.54-.54.705-.87l.131-.274-.481-.336z" fill="currentColor"/></svg>`,
  },
  {
    name: "GitHub",
    category: "Tools",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="currentColor"/></svg>`,
  },
  {
    name: "TypeScript",
    category: "Frontend",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor"/></svg>`,
  },
  {
    name: "JavaScript",
    category: "Frontend",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" fill="currentColor"/></svg>`,
  },
  {
    name: "Vue.js",
    category: "Frontend",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z" fill="currentColor"/></svg>`,
  },
]

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
      const url = `https://raw.githubusercontent.com/MED-007/MEDIcons/main/icons/${encodeURIComponent(fileName)}`
      let styleAttr = '';
      if (iconStyle !== 'none') {
        const radius = iconStyle === 'circle' ? '50%' : '10px'
        const bg = iconTheme === 'dark' ? '#1F2937' : iconTheme === 'light' ? '#ffffff' : 'transparent'
        styleAttr = ` style="background:${bg};border-radius:${radius};padding:8px;"`
      }
      const imgTag = `<img src="${url}" width="64px"${styleAttr} />`;
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
    [toast],
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
    [toast],
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
    if (iconTheme === 'dark') return 'bg-gray-800'
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
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <header className="w-full sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
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
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
              className="pl-10 border-gray-300 focus:border-[#E63946] focus:ring-[#E63946]"
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
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          {filteredIcons.map((icon, index) => (
            <Card
              key={`${icon.name}-${index}`}
              className={`p-4 cursor-pointer icon-hover border-2 transition-all duration-200 ${
                copiedIcon === icon.name
                  ? "border-[#E63946] bg-[#E63946]/5 copy-success"
                  : "border-gray-200 hover:border-[#E63946]/50"
              } ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              onClick={() => copyToClipboard(icon)}
            >
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`${getSizeClass()} ${getShapeClass()} ${getThemeBgClass()} text-gray-700 dark:text-gray-300 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full`}
                  dangerouslySetInnerHTML={{ __html: icon.svg }}
                />
                <div className="text-center">
                  <h3 className="font-medium text-sm">{icon.name}</h3>
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
