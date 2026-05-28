'use client'

import { useState, useEffect } from 'react'
import { AcademicYear } from '@/lib/types'
import { getAllResults } from '@/lib/data-fetchers'
import { Trophy, Award, TrendingUp } from 'lucide-react'

export default function ResultsPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [selectedClass, setSelectedClass] = useState<'10th' | '12th'>('10th')
  const [selectedYear, setSelectedYear] = useState<string>('')

  useEffect(() => {
    getAllResults().then(data => {
      setAcademicYears(data.academicYears)
      if (data.academicYears.length > 0) {
        setSelectedYear(data.academicYears[0].year)
      }
    })
  }, [])

  const currentYear = academicYears.find(y => y.year === selectedYear)
  
  // Filter toppers by selected class
  const filteredToppers = currentYear?.toppers.filter(topper => topper.class === selectedClass) || []
  
  // Calculate class-specific highlights
  const classHighlights = currentYear ? {
    totalStudents: currentYear.toppers.filter(t => t.class === selectedClass).length,
    above90Percent: currentYear.toppers.filter(t => t.class === selectedClass && t.percentage >= 90).length,
    above95Percent: currentYear.toppers.filter(t => t.class === selectedClass && t.percentage >= 95).length,
    perfectScores: currentYear.toppers.filter(t => t.class === selectedClass && t.percentage === 100).length,
    averagePercentage: currentYear.toppers.filter(t => t.class === selectedClass).length > 0
      ? (currentYear.toppers.filter(t => t.class === selectedClass).reduce((sum, t) => sum + t.percentage, 0) / 
         currentYear.toppers.filter(t => t.class === selectedClass).length).toFixed(1)
      : '0'
  } : null

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Results & Achievements</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Celebrating the outstanding achievements of our students
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4">
          {/* Class Filter */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-lg border-2 border-gray-300 p-1 bg-white">
              <button
                onClick={() => setSelectedClass('10th')}
                className={`px-6 py-2 rounded-md font-semibold transition-colors ${
                  selectedClass === '10th'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Class 10th
              </button>
              <button
                onClick={() => setSelectedClass('12th')}
                className={`px-6 py-2 rounded-md font-semibold transition-colors ${
                  selectedClass === '12th'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Class 12th
              </button>
            </div>
          </div>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-lg font-medium focus:outline-none focus:border-primary-500 bg-white"
          >
            {academicYears.map(year => (
              <option key={year.year} value={year.year}>
                Academic Year {year.year}
              </option>
            ))}
          </select>
        </div>

        {currentYear && classHighlights && (
          <>
            {/* Class-specific Highlights */}
            <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4 mb-8 text-center">
              <h3 className="text-xl font-bold text-primary-900 mb-2">
                CBSE Class {selectedClass} Board Results - {selectedYear}
              </h3>
              <p className="text-primary-700">
                Showing top performers and achievements
              </p>
            </div>

            {/* Highlights */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-card text-center">
                <TrendingUp className="mx-auto text-primary-600 mb-3" size={32} />
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {classHighlights.averagePercentage}%
                </div>
                <div className="text-gray-600">Average Percentage</div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-card text-center">
                <Award className="mx-auto text-green-600 mb-3" size={32} />
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {classHighlights.above90Percent}
                </div>
                <div className="text-gray-600">Above 90%</div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-card text-center">
                <Trophy className="mx-auto text-yellow-600 mb-3" size={32} />
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {classHighlights.above95Percent}
                </div>
                <div className="text-gray-600">Above 95%</div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-card text-center">
                <Trophy className="mx-auto text-orange-600 mb-3" size={32} />
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {classHighlights.perfectScores}
                </div>
                <div className="text-gray-600">Perfect Scores</div>
              </div>
            </div>

            {/* Toppers */}
            {filteredToppers.length > 0 ? (
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">
                  Top Performers - Class {selectedClass}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredToppers.map(topper => (
                  <div key={topper.rollNumber} className="bg-white p-6 rounded-lg shadow-card hover:shadow-card-hover transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{topper.name}</h3>
                        <p className="text-gray-600">{topper.class}</p>
                        {topper.stream && <p className="text-sm text-gray-500">{topper.stream}</p>}
                      </div>
                      <div className="text-2xl font-bold text-primary-600">
                        {topper.percentage}%
                      </div>
                    </div>

                    {/* Subject Marks */}
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Subject Scores:</h4>
                      <div className="space-y-1">
                        {Object.entries(topper.subjects).map(([subject, marks]) => (
                          <div key={subject} className="flex justify-between text-sm">
                            <span className="text-gray-600">{subject}</span>
                            <span className="font-semibold">{marks}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    {topper.achievements.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">Achievements:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {topper.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Testimonial */}
                    {topper.testimonial && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 italic">&quot;{topper.testimonial}&quot;</p>
                      </div>
                    )}
                  </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-card">
                <p className="text-gray-600 text-lg">
                  No results available for Class {selectedClass} in {selectedYear}
                </p>
              </div>
            )}

            {/* Competitive Exams - Only show for 12th class */}
            {selectedClass === '12th' && currentYear.competitiveExams && currentYear.competitiveExams.length > 0 && (
              <div className="bg-white p-8 rounded-lg shadow-card">
                <h2 className="text-3xl font-bold mb-6 text-center">Competitive Exam Results</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {currentYear.competitiveExams.map((exam, i) => (
                    <div key={i} className="text-center p-6 border-2 border-gray-100 rounded-lg">
                      <h3 className="text-xl font-bold mb-2">{exam.exam}</h3>
                      <div className="text-3xl font-bold text-primary-600 mb-2">{exam.qualified}</div>
                      <div className="text-gray-600 mb-2">Students Qualified</div>
                      <div className="text-sm text-gray-500">Top Rank: AIR {exam.topRank}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
