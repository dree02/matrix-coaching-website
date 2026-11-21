import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

const PYTHON_PATH = '/Users/dhruvrawat/Desktop/My Work/AI-Grader/ai_grader/venv/bin/python'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const publicTestDir = path.join(process.cwd(), 'public', 'tests', id)
    const dataTestDir = path.join(process.cwd(), 'data', 'tests', id)
    fs.mkdirSync(publicTestDir, { recursive: true })
    fs.mkdirSync(dataTestDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const qpPath = path.join(publicTestDir, 'question_paper.pdf')
    fs.writeFileSync(qpPath, buffer)

    const outJsonPath = path.join(dataTestDir, 'answer_key.json')
    const outPdfPath = path.join(publicTestDir, 'answer_key.pdf')
    const scriptPath = path.join(process.cwd(), 'scripts', 'generate_key.py')

    console.log(`Generating answer key for test ${id}...`)
    const { stdout, stderr } = await execFileAsync(PYTHON_PATH, [scriptPath, qpPath, outJsonPath, outPdfPath])
    
    if (stderr) {
      console.warn('Script stderr:', stderr)
    }

    const answerKey = JSON.parse(fs.readFileSync(outJsonPath, 'utf-8'))

    // Update meta.json
    const metaPath = path.join(dataTestDir, 'meta.json')
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
      meta.questionPaperUrl = `/tests/${id}/question_paper.pdf`
      meta.answerKeyPdfUrl = `/tests/${id}/answer_key.pdf`
      meta.status = 'ready_for_review'
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2))
    }

    return NextResponse.json({
      success: true,
      answerKey,
      questionPaperUrl: `/tests/${id}/question_paper.pdf`,
      answerKeyPdfUrl: `/tests/${id}/answer_key.pdf`
    })
  } catch (error: any) {
    console.error('Error generating answer key:', error)
    return NextResponse.json({ error: error.message || 'Failed to process question paper' }, { status: 500 })
  }
}
