import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data', 'tests')
const indexFile = path.join(dataDir, 'index.json')

export async function GET() {
  try {
    if (!fs.existsSync(indexFile)) {
      return NextResponse.json({ tests: [] })
    }
    const data = fs.readFileSync(indexFile, 'utf-8')
    const tests = JSON.parse(data)
    return NextResponse.json({ tests })
  } catch (error) {
    console.error('Error reading tests:', error)
    return NextResponse.json({ error: 'Failed to read tests' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, branch, className, subject, topic, totalMarks } = body

    if (!title || !branch || !className || !subject) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const id = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`
    const newTest = {
      id,
      title,
      branch,
      class: className,
      subject,
      topic: topic || title,
      totalMarks: Number(totalMarks) || 30,
      status: 'pending_paper',
      createdAt: new Date().toISOString(),
      studentsCount: 0,
      averageScore: 'Pending'
    }

    // Read index
    let tests = []
    if (fs.existsSync(indexFile)) {
      tests = JSON.parse(fs.readFileSync(indexFile, 'utf-8'))
    }
    tests.unshift(newTest)
    fs.writeFileSync(indexFile, JSON.stringify(tests, null, 2))

    // Create test folder & meta.json
    const testFolder = path.join(dataDir, id)
    fs.mkdirSync(testFolder, { recursive: true })
    fs.mkdirSync(path.join(process.cwd(), 'public', 'tests', id, 'results'), { recursive: true })

    const meta = {
      ...newTest,
      questionPaperUrl: null,
      answerKeyPdfUrl: null,
      students: []
    }
    fs.writeFileSync(path.join(testFolder, 'meta.json'), JSON.stringify(meta, null, 2))

    return NextResponse.json({ test: newTest })
  } catch (error) {
    console.error('Error creating test:', error)
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 })
  }
}
