'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  Search,
  Filter,
  ArrowRight,
  TrendingUp
} from 'lucide-react'

interface TestItem {
  id: string
  title: string
  branch: string
  class: string
  subject: string
  topic: string
  totalMarks: number
  status: 'graded' | 'ready_for_grading' | 'pending_paper'
  createdAt: string
  studentsCount: number
  averageScore?: string
}

export default function TeacherPortal() {
  const [tests, setTests] = useState<TestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState<string>('All')
  const [selectedClass, setSelectedClass] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    branch: 'Shalimar Garden',
    className: 'Class 10',
    subject: 'Mathematics',
    topic: '',
    totalMarks: 30
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/teacher/tests')
      const data = await res.json()
      if (data.tests) {
        setTests(data.tests)
      }
    } catch (e) {
      console.error('Failed to load tests:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.topic) return
    setCreating(true)

    try {
      const res = await fetch('/api/teacher/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.test) {
        setIsModalOpen(false)
        setFormData({
          title: '',
          branch: 'Shalimar Garden',
          className: 'Class 10',
          subject: 'Mathematics',
          topic: '',
          totalMarks: 30
        })
        fetchTests()
      }
    } catch (err) {
      console.error('Failed creating test:', err)
    } finally {
      setCreating(false)
    }
  }

  const filteredTests = tests.filter((t) => {
    const matchesBranch = selectedBranch === 'All' || t.branch === selectedBranch
    const matchesClass = selectedClass === 'All' || t.class === selectedClass
    const matchesQuery = searchQuery === '' || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.topic.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesBranch && matchesClass && matchesQuery
  })

  const totalStudentsGraded = tests.reduce((acc, t) => acc + (t.studentsCount || 0), 0)

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary-100 text-primary-800 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} /> Matrix AI Grader Portal
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                Free WhatsApp Bot Active
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Teacher Assessment Dashboard
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Upload tests, review AI marking schemes, auto-extract student details, and dispatch result sheets.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all"
          >
            <Plus size={18} />
            <span>Create New Assessment</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Active Tests</p>
              <p className="text-2xl font-bold text-slate-800">{tests.length}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Papers Graded</p>
              <p className="text-2xl font-bold text-slate-800">{totalStudentsGraded}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">AI Accuracy Guard</p>
              <p className="text-2xl font-bold text-slate-800">Teacher Approved</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">WhatsApp Cost</p>
              <p className="text-2xl font-bold text-emerald-600">₹0 Free</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
              <Filter size={16} /> Filter by:
            </div>

            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
            >
              <option value="All">All Branches</option>
              <option value="Shalimar Garden">Shalimar Garden</option>
              <option value="Dilshad Garden">Dilshad Garden</option>
            </select>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
            >
              <option value="All">All Classes</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search chapter or test name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Tests Grid */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            <p className="text-slate-500 text-sm mt-3">Loading your assessments...</p>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <FileText size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No Assessments Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mt-1 mb-5">
              No tests match your filter criteria or you haven't created one yet.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-4 py-2 rounded-lg text-sm"
            >
              <Plus size={16} /> Create First Test
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                      {test.class} • {test.subject}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        test.status === 'graded'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : test.status === 'ready_for_grading'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {test.status === 'graded' && <CheckCircle2 size={12} />}
                      {test.status === 'ready_for_grading' && <Clock size={12} />}
                      {test.status === 'graded'
                        ? 'Completed'
                        : test.status === 'ready_for_grading'
                        ? 'Ready to Grade'
                        : 'Draft'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                    {test.title}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-4">
                    <MapPin size={13} className="text-slate-400" />
                    <span>{test.branch} Branch</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-t border-slate-100 text-xs">
                    <div>
                      <p className="text-slate-400 font-medium">Students</p>
                      <p className="text-slate-800 font-bold text-sm mt-0.5">{test.studentsCount} Papers</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Total Marks</p>
                      <p className="text-slate-800 font-bold text-sm mt-0.5">{test.totalMarks} Marks</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {test.status === 'graded' ? 'All result sheets ready' : 'Marking room open'}
                  </span>
                  <Link
                    href={`/teacher/test/${test.id}`}
                    className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-bold text-sm"
                  >
                    Manage Test <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Create Test Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create New Assessment</h2>
            <p className="text-slate-500 text-xs mb-5">
              Set up a chapter unit test. You will upload the Question Paper next to create the AI marking scheme.
            </p>

            <form onSubmit={handleCreateTest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Test Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10 - Circles Chapter Test"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Branch
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="Shalimar Garden">Shalimar Garden</option>
                    <option value="Dilshad Garden">Dilshad Garden</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Class
                  </label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Topic / Chapter Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Triangles, Quadratic Equations, Light"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Continue to Test Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
