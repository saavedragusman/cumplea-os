import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
import { join, extname, parse } from 'node:path'
import { existsSync } from 'node:fs'

const dirs = [
  { src: 'public/images/gabriel', pattern: /\.jpe?g$/i },
  { src: 'public/images/familia', pattern: /\.jpe?g$/i },
]

const MAX_SIZE = 1200
const WEBP_QUALITY = 80

let total = 0
let skipped = 0

for (const { src, pattern } of dirs) {
  const fullPath = join(process.cwd(), src)
  const files = (await readdir(fullPath)).filter((f) => pattern.test(f))

  for (const file of files) {
    const input = join(fullPath, file)
    const { name } = parse(file)
    const output = join(fullPath, `${name}.webp`)

    if (existsSync(output)) {
      skipped++
      continue
    }

    const img = sharp(input)
    const meta = await img.metadata()

    const width = meta.width
    const height = meta.height
    const longest = Math.max(width, height)

    let resize = null
    if (longest > MAX_SIZE) {
      if (width >= height) {
        resize = { width: MAX_SIZE }
      } else {
        resize = { height: MAX_SIZE }
      }
    }

    const builder = img.webp({ quality: WEBP_QUALITY })
    if (resize) builder.resize(resize)

    await builder.toFile(output)

    const origKB = (meta.size / 1024).toFixed(0)
    const outStat = await import('node:fs/promises').then((m) => m.stat(output))
    const outKB = (outStat.size / 1024).toFixed(0)
    const saved = ((1 - outStat.size / meta.size) * 100).toFixed(0)
    const dims = resize
      ? `↘ ${width}×${height} → ${resize.width || 'auto'}×${resize.height || 'auto'}`
      : `✓ ${width}×${height} (ya entra)`

    console.log(`  ${file.padEnd(32)} ${origKB}KB → ${outKB}KB (${saved}%) ${dims}`)
    total++
  }
}

console.log(`\n✅ Listo: ${total} convertidas, ${skipped} ya existían`)
