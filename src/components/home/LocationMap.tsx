'use client'

import { CenterInfo } from '@/lib/types'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

interface LocationMapProps {
  info: CenterInfo
}

// Helper function to check if academy is currently open
function getAcademyStatus() {
  const now = new Date()
  const day = now.getDay() // 0 = Sunday, 1 = Monday, etc.
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const currentTime = hours * 60 + minutes // Convert to minutes for easier comparison
  
  // Closed on Sundays
  if (day === 0) {
    return { isOpen: false, message: 'Closed - Sunday' }
  }
  
  // Open 2:00 PM - 9:00 PM (14:00 - 21:00)
  const openTime = 14 * 60 // 2:00 PM in minutes
  const closeTime = 21 * 60 // 9:00 PM in minutes
  
  if (currentTime >= openTime && currentTime < closeTime) {
    return { isOpen: true, message: 'Open Now' }
  } else if (currentTime < openTime) {
    return { isOpen: false, message: `Opens at 2:00 PM` }
  } else {
    return { isOpen: false, message: 'Closed for the day' }
  }
}

export default function LocationMap({ info }: LocationMapProps) {
  const [academyStatus, setAcademyStatus] = useState(getAcademyStatus())

  // Update status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setAcademyStatus(getAcademyStatus())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const BRANCH_EMBED_URLS: { [key: string]: string } = {
    'branch-rajendra': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.199348393305!2d77.3521172!3d28.683682799999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfbae01e54e8b%3A0x72c6da213d520df2!2sMatrix%20Academy%20Rajender%20Nagar!5e0!3m2!1sen!2sin!4v1779957496028!5m2!1sen!2sin',
    'branch-shalimar': 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3500.199348393305!2d77.3495423!3d28.6836828!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfa5a73344087%3A0x95003666fb7c9953!2sMatrix%20Academy!5e0!3m2!1sen!2sin!4v1779957481171!5m2!1sen!2sin'
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Visit Our Centers
        </h2>
        <p className="text-center text-gray-600 mb-12">We have two conveniently located branches to serve you better</p>

        {/* Branches */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {info.branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-lg shadow-card p-6">
              <h3 className="text-2xl font-bold mb-4">{branch.name}</h3>

              <div className="flex items-start gap-3 mb-6">
                <MapPin className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-gray-700">
                    {branch.address.street}<br />
                    {branch.address.area}<br />
                    {branch.address.city}, {branch.address.state} - {branch.address.pincode}
                  </p>
                  {branch.contact && (
                    <p className="text-gray-700 mt-2 flex items-center gap-2">
                      <Phone size={16} className="text-primary-600" />
                      <a href={`tel:${branch.contact.phone}`} className="hover:text-primary-600">
                        {branch.contact.phone}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <a
                href={branch.address.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Get Directions to {branch.name}
              </a>

              {/* Map Preview */}
              <div className="mt-4 bg-gray-200 rounded-lg h-64 overflow-hidden">
                <iframe
                  src={BRANCH_EMBED_URLS[branch.id] || ''}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${branch.name}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Contact Info (Shared across branches) */}
        <div className="bg-white rounded-lg shadow-card p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Get in Touch</h3>
          <div className="grid md:grid-cols-3 gap-6">

            <div className="flex items-start gap-3 text-center flex-col items-center">
              <Phone className="text-primary-600" size={32} />
              <div>
                <h4 className="font-semibold text-lg mb-1">Phone</h4>
                <div className="space-y-1">
                  <a href="tel:+919212355119" className="text-gray-700 hover:text-primary-600 block">
                    +91-9212355119
                  </a>
                  <a href="tel:+919212355118" className="text-gray-700 hover:text-primary-600 block">
                    +91-9212355118
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-center flex-col items-center">
              <Mail className="text-primary-600" size={32} />
              <div>
                <h4 className="font-semibold text-lg mb-1">Email</h4>
                <a href={`mailto:${info.contact.email}`} className="text-gray-700 hover:text-primary-600">
                  {info.contact.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-center flex-col items-center">
              <Clock className="text-primary-600" size={32} />
              <div>
                <h4 className="font-semibold text-lg mb-1">Academy Hours</h4>
                <div className="space-y-1">
                  <p className="text-gray-700 text-sm">Mon - Sat: 2:00 PM - 9:00 PM</p>
                  <p className="text-gray-700 text-sm">Sunday: Closed</p>
                  <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    academyStatus.isOpen 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      academyStatus.isOpen ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    {academyStatus.message}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
