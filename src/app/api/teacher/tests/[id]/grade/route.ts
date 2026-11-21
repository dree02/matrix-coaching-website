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
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No student files uploaded' }, { status: 400 })
    }

    const dataTestDir = path.join(process.cwd(), 'data', 'tests', id)
    const publicResultsDir = path.join(process.cwd(), 'public', 'tests', id, 'results')
    const submissionsDir = path.join(dataTestDir, 'submissions')
    const keyPath = path.join(dataTestDir, 'answer_key.json')

    if (!fs.existsSync(keyPath)) {
      return NextResponse.json({ error: 'Answer key not found. Please generate and approve answer key first.' }, { status: 400 })
    }

    fs.mkdirSync(submissionsDir, { recursive: true })
    fs.mkdirSync(publicResultsDir, { recursive: true })

    const scriptPath = path.join(process.cwd(), 'scripts', 'grade_paper.py')
    const urlPrefix = `/tests/${id}/results`

    const metaPath = path.join(dataTestDir, 'meta.json')
    let meta: any = { students: [] }
    if (fs.existsSync(metaPath)) {
      meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    }

    const newlyGraded = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const tempPdfPath = path.join(submissionsDir, `${Date.now()}_${file.name}`)
      fs.writeFileSync(tempPdfPath, buffer)

      try {
        console.log(`Grading submission: ${file.name}...`)
        const { stdout, stderr } = await execFileAsync(PYTHON_PATH, [
          scriptPath,
          tempPdfPath,
          keyPath,
          publicResultsDir,
          urlPrefix
        ])

        if (stderr) {
          console.warn('Grading stderr:', stderr)
        }

        const resData = JSON.parse(stdout.trim())
        if (resData.success) {
          const studentRecord = {
            id: `student-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: resData.name,
            phone: resData.phone,
            score: resData.score,
            totalMarks: resData.totalMarks,
            pdfUrl: resData.pdfUrl,
            whatsappStatus: 'ready',
            gradedAt: new Date().toISOString()
          }

          meta.students.unshift(studentRecord)
          meta.studentsCount = meta.students.length
          newlyGraded.push(studentRecord)
        }
      } catch (err) {
        console.error(`Failed to grade ${file.name}:`, err)
      }
    }

    meta.status = 'graded'
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2))

    // Also update index.json if present
    const indexFile = path.join(process.cwd(), 'data', 'tests', 'index.json')
    if (fs.existsSync(indexFile)) {
      const indexTests = JSON.parse(fs.readFileSync(indexFile, 'utf-8'))
      const updatedIndex = indexTests.map((t: any) => {
        if (t.id === id) {
          return {
            ...t,
            status: 'graded',
            studentsCount: meta.studentsCount
          }
        }
        return t
      })
      fs.writeFileSync(indexFile, JSON.stringify(updatedIndex, null, 2))
    }

    return NextResponse.json({
      success: true,
      gradedCount: newlyGraded.length,
      students: meta.students
    })
  } catch (error: any) {
    console.error('Error during batch grading:', error)
    return NextResponse.json({ error: error.message || 'Failed to grade submissions' }, { status: 500 })
  }
}
