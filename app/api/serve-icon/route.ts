import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { promises as fs } from 'fs'
import path from 'path'

/*
  GET /api/serve-icon?file=adobe%20photoshop.svg&theme=light&style=circle&size=64
  Query params:
    file  - required, the svg filename inside /icons folder
    theme - optional: 'transparent' (default) | 'light' | 'dark'
    style - optional: 'none' (default) | 'rect' | 'circle'
    size  - optional: pixel size (1-512) default 64

  Responds with an SVG that wraps the original icon, adding a background rectangle/circle
  according to requested theme+style so users can reference a single URL without needing
  inline CSS which some markdown renderers strip.
*/

export async function GET(request: Request) {
  const url = new URL(request.url)
  const search = url.searchParams

  const file = search.get('file')
  if (!file) {
    return NextResponse.json({ error: 'Missing "file" query parameter' }, { status: 400 })
  }

  const theme = (search.get('theme') ?? 'transparent') as 'transparent' | 'light' | 'dark'
  const style = (search.get('style') ?? 'none') as 'none' | 'rect' | 'circle'
  const sizeParam = parseInt(search.get('size') || '64', 10)
  const size = isNaN(sizeParam) ? 64 : Math.max(8, Math.min(sizeParam, 512))

  const iconsDir = path.join(process.cwd(), 'icons')
  const filePath = path.join(iconsDir, file)

  try {
    let svgData = await fs.readFile(filePath, 'utf-8')

    // If no styling requested just return original SVG for maximum compatibility
    if (style === 'none' && theme === 'transparent') {
      return new NextResponse(svgData, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // Build background element if requested
    const bgColor = theme === 'dark' ? '#1F2937' : theme === 'light' ? '#ffffff' : 'none'
    let background = ''
    if (style !== 'none') {
      if (style === 'circle') {
        background = `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${bgColor}" />`
      } else if (style === 'rect') {
        background = `<rect width="100%" height="100%" rx="10" fill="${bgColor}" />`
      }
    }

    // Inline original SVG and center/scale it within the background so it is not stuck at top-left
    // Strip XML prolog and extract inner <svg> content only
    svgData = svgData.replace(/<\?xml[^>]*?>/i, '').trim()
    // Remove outer <svg ...> tag to embed raw paths
    const inner = svgData.replace(/<svg[^>]*?>/i, '').replace(/<\/svg>/i, '').trim()

    const scale = (size * 0.6) / 24; // 60% of canvas, assuming original icons use 24×24
    const offset = (size - 24 * scale) / 2;

    const wrapped = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">\n  ${background}\n  <g transform="translate(${offset} ${offset}) scale(${scale})">\n    ${inner}\n  </g>\n</svg>`

    return new NextResponse(wrapped, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read icon' }, { status: 500 })
  }
}
