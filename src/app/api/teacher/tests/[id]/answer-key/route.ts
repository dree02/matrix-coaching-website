import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data', 'tests')

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()
    const { answerKey, approved } = body

    const testFolder = path.join(dataDir, id)
    const keyFile = path.join(testFolder, 'answer_key.json')
    const metaFile = path.join(testFolder, 'meta.json')

    if (!fs.existsSync(testFolder)) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // Save answer key
    if (answerKey) {
      fs.writeFileSync(keyFile, JSON.stringify(answerKey, null, 2))
    }

    // Update meta status if approved
    if (fs.existsSync(metaFile)) {
      const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'))
      if (approved) {
        meta.status = meta.studentsCount > 0 ? 'graded' : 'ready_for_grading'
        meta.answerKeyApproved = true
      }
      fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2))
    }

    return NextResponse.json({ success: true, answerKey })
  } catch (error) {
    console.error('Error updating answer key:', error)
    return NextResponse.json({ error: 'Failed to update answer key' }, { status: 500 })
  }
}
