import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data', 'tests')

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const testFolder = path.join(dataDir, id)
    const metaFile = path.join(testFolder, 'meta.json')
    const keyFile = path.join(testFolder, 'answer_key.json')

    if (!fs.existsSync(metaFile)) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'))
    let answerKey = null
    if (fs.existsSync(keyFile)) {
      try {
        answerKey = JSON.parse(fs.readFileSync(keyFile, 'utf-8'))
      } catch (e) {
        console.error('Error parsing answer key:', e)
      }
    }

    return NextResponse.json({ test: meta, answerKey })
  } catch (error) {
    console.error('Error fetching test:', error)
    return NextResponse.json({ error: 'Failed to fetch test' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()
    const testFolder = path.join(dataDir, id)
    const metaFile = path.join(testFolder, 'meta.json')

    if (!fs.existsSync(metaFile)) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'))

    // Allow updating student phone/name or status
    if (body.students) {
      meta.students = body.students
    }
    if (body.studentUpdate) {
      const { studentId, phone, name } = body.studentUpdate
      meta.students = meta.students.map((s: any) => {
        if (s.id === studentId) {
          return {
            ...s,
            phone: phone !== undefined ? phone : s.phone,
            name: name !== undefined ? name : s.name
          }
        }
        return s
      })
    }
    if (body.whatsappStatusUpdate) {
      const { studentId, status } = body.whatsappStatusUpdate
      meta.students = meta.students.map((s: any) => {
        if (s.id === studentId) {
          return { ...s, whatsappStatus: status }
        }
        return s
      })
    }

    fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2))
    return NextResponse.json({ success: true, test: meta })
  } catch (error) {
    console.error('Error updating test:', error)
    return NextResponse.json({ error: 'Failed to update test' }, { status: 500 })
  }
}
