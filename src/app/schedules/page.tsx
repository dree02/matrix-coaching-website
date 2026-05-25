'use client'

import { useState, useEffect } from 'react'
import { ClassSchedule } from '@/lib/types'
import { getAllSchedules, formatCurrency } from '@/lib/data-fetchers'
import { Clock, Users, GraduationCap, IndianRupee } from 'lucide-react'

export default function SchedulesPage() {
  const [classes, setClasses] = useState<ClassSchedule[]>([])
  const [selectedClass, setSelectedClass] = useState<string>('')

  useEffect(() => {
    getAllSchedules().then(data => {
      setClasses(data.classes)
      if (data.classes.length > 0) {
        setSelectedClass(data.classes[0].id)
      }
    })
  }, [])

  const currentClass = classes.find(c => c.id === selectedClass)

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Schedules & Fees</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose your class to view available batches, timings, and fee structure
        </p>

        {/* Class Filter */}
        <div className="mb-8 flex justify-center">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-medium focus:outline-none focus:border-primary-500"
          >
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        {/* Batch Cards */}
        {currentClass && (
          <div className="space-y-4 mb-8">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">{currentClass.name}</h2>
              <p className="text-gray-600">Board: {currentClass.board}</p>
              <p className="text-gray-600">Subjects: {currentClass.subjects.join(', ')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {currentClass.batches.map(batch => (
                <div key={batch.id} className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{batch.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      batch.enrolled < batch.capacity 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {batch.enrolled < batch.capacity ? 'Seats Available' : 'Full'}
                    </span>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-start gap-3 mb-4">
                    <Clock className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">{batch.schedule.time}</p>
                      <p className="text-gray-600">{batch.schedule.days.join(', ')}</p>
                    </div>
                  </div>

                  {/* Teacher */}
                  <div className="flex items-start gap-3 mb-4">
                    <GraduationCap className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">{batch.teacher.name}</p>
                      <p className="text-sm text-gray-600">{batch.teacher.qualification}</p>
                      <p className="text-sm text-gray-600">{batch.teacher.experience} experience</p>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="text-primary-600" size={20} />
                    <span className="text-gray-700">
                      {batch.enrolled}/{batch.capacity} students enrolled
                    </span>
                  </div>

                  {/* Fees */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <IndianRupee className="text-primary-600" size={20} />
                      <span className="font-semibold">Fee Structure</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Monthly:</span>
                        <span className="font-semibold ml-2">{formatCurrency(batch.fees.monthly)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quarterly:</span>
                        <span className="font-semibold ml-2">{formatCurrency(batch.fees.quarterly)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Half-Yearly:</span>
                        <span className="font-semibold ml-2">{formatCurrency(batch.fees.halfYearly)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Annual:</span>
                        <span className="font-semibold ml-2">{formatCurrency(batch.fees.annual)}</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    Inquire Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
