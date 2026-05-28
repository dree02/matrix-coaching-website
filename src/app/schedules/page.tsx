'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ClassSchedule } from '@/lib/types'
import { getAllSchedules, formatCurrency } from '@/lib/data-fetchers'
import { Clock, GraduationCap, IndianRupee, MapPin, ExternalLink } from 'lucide-react'

const BRANCHES = [
  {
    id: 'rajendra-nagar',
    name: 'Rajendra Nagar',
    location: 'Sector 5, Rajendra Nagar, Sahibabad',
    googleMapsUrl: 'https://maps.app.goo.gl/Ff3QvkHiWJxSpBtGA',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.199348393305!2d77.3521172!3d28.683682799999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfbae01e54e8b%3A0x72c6da213d520df2!2sMatrix%20Academy%20Rajender%20Nagar!5e0!3m2!1sen!2sin!4v1779957496028!5m2!1sen!2sin'
  },
  {
    id: 'shalimar-garden',
    name: 'Shalimar Garden',
    location: 'S-14 First Floor, Shalimar Garden, Sahibabad',
    googleMapsUrl: 'https://maps.app.goo.gl/Wd1y7an2kg9YTfXPA',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3500.199348393305!2d77.3495423!3d28.6836828!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfa5a73344087%3A0x95003666fb7c9953!2sMatrix%20Academy!5e0!3m2!1sen!2sin!4v1779957481171!5m2!1sen!2sin'
  }
]

function shouldShowSubjectFilter(classSchedule: ClassSchedule): boolean {
  if (!classSchedule || classSchedule.batches.length <= 1) return false
  
  const allCombinedBatch = classSchedule.batches.every(batch => {
    const name = batch.name.toLowerCase()
    return name.includes('mathematics') && name.includes('science')
  })
  
  return !allCombinedBatch
}

function extractSubjectsFromBatches(batches: ClassSchedule['batches']): string[] {
  const subjects = new Set<string>()
  
  batches.forEach(batch => {
    const name = batch.name.toLowerCase()
    
    if (name.includes('pcm')) {
      subjects.add('PCM (Physics, Chemistry, Mathematics)')
    } else {
      if (name.includes('math') || name.includes('maths')) {
        subjects.add('Mathematics')
      }
      if (name.includes('science')) {
        subjects.add('Science')
      }
      if (name.includes('physics')) {
        subjects.add('Physics')
      }
      if (name.includes('chemistry')) {
        subjects.add('Chemistry')
      }
    }
    
    if (name.includes('english')) subjects.add('English')
    if (name.includes('social') || name.includes('sst')) subjects.add('Social Studies')
    if (name.includes('applied')) subjects.add('Applied Mathematics')
    if (name.includes('account')) subjects.add('Accounts')
  })
  
  return Array.from(subjects)
}

function matchesBatchSubject(batchName: string, selectedSubject: string): boolean {
  const name = batchName.toLowerCase()
  const subject = selectedSubject.toLowerCase()
  
  switch (subject) {
    case 'mathematics':
      return (name.includes('math') || name.includes('maths')) && 
             !name.includes('pcm') && !name.includes('applied')
    case 'science':
      return name.includes('science') && !name.includes('pcm')
    case 'english':
      return name.includes('english')
    case 'social studies':
      return name.includes('sst') || name.includes('social')
    case 'pcm (physics, chemistry, mathematics)':
      return name.includes('pcm')
    case 'physics':
      return name.includes('physics') && !name.includes('pcm')
    case 'chemistry':
      return name.includes('chemistry') && !name.includes('pcm')
    case 'accounts':
      return name.includes('account')
    case 'applied mathematics':
      return name.includes('applied')
    default:
      return name.includes(subject)
  }
}

function normalizeBranchId(branchName: string): string {
  return branchName.toLowerCase().replace(/\s+/g, '-')
}

export default function SchedulesPage() {
  const [allClasses, setAllClasses] = useState<ClassSchedule[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>('rajendra-nagar')
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')

  useEffect(() => {
    getAllSchedules().then(data => {
      setAllClasses(data.classes)
      const branchClasses = data.classes.filter(c => 
        normalizeBranchId(c.branch) === 'rajendra-nagar'
      )
      if (branchClasses.length > 0) {
        setSelectedClass(branchClasses[0].id)
      }
    })
  }, [])

  const branchClasses = allClasses.filter(c => 
    normalizeBranchId(c.branch) === selectedBranch
  )

  const uniqueClasses = branchClasses.reduce((acc, cls) => {
    if (!acc.find(c => c.name === cls.name)) {
      acc.push({ id: cls.id, name: cls.name })
    }
    return acc
  }, [] as { id: string; name: string }[])

  useEffect(() => {
    if (branchClasses.length > 0 && !branchClasses.find(c => c.id === selectedClass)) {
      setSelectedClass(branchClasses[0].id)
      setSelectedSubject('all')
    }
  }, [selectedBranch, branchClasses, selectedClass])

  const currentClass = branchClasses.find(c => c.id === selectedClass)
  const currentBranchInfo = BRANCHES.find(b => b.id === selectedBranch)

  const showSubjectFilter = currentClass ? shouldShowSubjectFilter(currentClass) : false
  const availableSubjects = showSubjectFilter && currentClass 
    ? extractSubjectsFromBatches(currentClass.batches)
    : []

  const filteredBatches = currentClass?.batches.filter(batch => {
    if (selectedSubject === 'all') return true
    return matchesBatchSubject(batch.name, selectedSubject)
  }) || []

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Schedules & Fees</h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Choose your branch and class to view available batches, timings, and fee structure
        </p>

        <div className="mb-6 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold mb-3 text-center">Select Branch</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {BRANCHES.map(branch => (
              <button
                key={branch.id}
                onClick={() => setSelectedBranch(branch.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedBranch === branch.id
                    ? 'border-primary-600 bg-primary-50 shadow-md'
                    : 'border-gray-300 bg-white hover:border-primary-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{branch.name}</h3>
                  {selectedBranch === branch.id && (
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 flex justify-center">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-lg font-medium focus:outline-none focus:border-primary-500 bg-white"
          >
            {uniqueClasses.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        {currentClass && showSubjectFilter && availableSubjects.length > 0 && (
          <div className="mb-8 flex justify-center">
            <div className="inline-flex flex-col items-center">
              <label className="text-sm font-semibold text-gray-700 mb-2">Select Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg text-lg font-medium focus:outline-none focus:border-primary-500 bg-white min-w-[250px]"
              >
                <option value="all">All Subjects</option>
                {availableSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {currentClass && currentBranchInfo && (
          <div className="space-y-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-bold mb-3">{currentClass.name}</h2>
                  <div className="space-y-1 mb-4">
                    <p className="text-gray-600">
                      <span className="font-semibold">Board:</span> {currentClass.board}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Subjects:</span> {currentClass.subjects.join(', ')}
                    </p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg mb-2">{currentBranchInfo.name}</h3>
                    <div className="flex items-start gap-2 text-gray-600 mb-2">
                      <MapPin className="flex-shrink-0 mt-1" size={18} />
                      <span>{currentBranchInfo.location}</span>
                    </div>
                    <a
                      href={currentBranchInfo.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View on Google Maps <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                <div className="md:col-span-1">
                  <div className="rounded-lg overflow-hidden border-2 border-gray-200 h-full min-h-[200px]">
                    <iframe
                      src={currentBranchInfo.embedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: '200px' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${currentBranchInfo.name} Location`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredBatches.length > 0 ? (
                filteredBatches.map(batch => (
                  <div key={batch.id} className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow">
                    <h3 className="text-xl font-bold mb-4">{batch.name}</h3>

                    <div className="flex items-start gap-3 mb-4">
                      <Clock className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold">{batch.schedule.time}</p>
                        <p className="text-gray-600">{batch.schedule.days.join(', ')}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      <GraduationCap className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold">{batch.teacher.name}</p>
                        <p className="text-sm text-gray-600">{batch.teacher.qualification}</p>
                        <p className="text-sm text-gray-600">{batch.teacher.experience} experience</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4 border-t pt-4">
                      <IndianRupee className="text-primary-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Monthly Fee</p>
                        <p className="text-xl font-bold text-primary-600">{formatCurrency(batch.fees.monthly)}</p>
                      </div>
                    </div>

                    <Link 
                      href="/contact"
                      className="w-full mt-4 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors block text-center"
                    >
                      Inquire Now
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-600 text-lg">No batches available for the selected subject.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
