import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { promises as fs } from 'fs'
import path from 'path'

// Returns JSON array: [{ name: string, svg: string, file: string }]
export async function GET() {
  try {
    const iconsDir = path.join(process.cwd(), 'icons')
    const files = await fs.readdir(iconsDir)

    const icons = await Promise.all(
      files
        .filter((f) => f.toLowerCase().endsWith('.svg'))
        .map(async (file) => {
          const filePath = path.join(iconsDir, file)
          const svg = await fs.readFile(filePath, 'utf-8')
          // Derive a readable name from the filename, strip extension and any extra characters
          const rawName = path.parse(file).name
          const cleaned = rawName.replace(/\s+|_/g, ' ').replace(/\([^)]*\)/g, '').trim()
          const name = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
          return { name, svg, file }
        }),
    )

    return NextResponse.json(icons)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read icons' }, { status: 500 })
  }
}
