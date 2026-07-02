import { google } from 'googleapis'

const SHEET_ID = process.env.GOOGLE_SHEET_ID
const CREDENTIALS = process.env.GOOGLE_SHEETS_CREDENTIALS

if (!SHEET_ID || !CREDENTIALS) {
  throw new Error('Faltan GOOGLE_SHEET_ID o GOOGLE_SHEETS_CREDENTIALS en las variables de entorno')
}

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })

/**
 * GET /api/manada → devuelve todas las filas y totales
 * POST /api/manada → agrega una fila { nombre, personas }
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'A:C',
      })

      const rows = response.data.values ?? []
      const entries = rows
        .slice(1) // saltear encabezados
        .filter((row) => row[0]?.trim())
        .map((row) => ({
          nombre: row[0].trim(),
          personas: parseInt(row[1], 10) || 1,
          fecha: row[2] ?? null,
        }))

      const totalPersonas = entries.reduce((sum, e) => sum + e.personas, 0)

      return res.status(200).json({
        entries,
        totalPersonas,
        totalFamilias: entries.length,
      })
    }

    if (req.method === 'POST') {
      const { nombre, personas } = req.body

      if (!nombre?.trim()) {
        return res.status(400).json({ error: 'El nombre es requerido' })
      }

      const ahora = new Date().toLocaleString('es-VE', {
        timeZone: 'America/Caracas',
      })

      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'A:C',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[nombre.trim(), Math.max(1, Number(personas) || 1), ahora]],
        },
      })

      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (error) {
    console.error('Sheets API error:', error)
    return res.status(500).json({
      error: 'Error al comunicarse con Google Sheets',
      detail: error.message,
    })
  }
}
