'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/data-fetchers'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    class: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const message = `Hello! I'm interested in admission.\n\nName: ${formData.name}\nPhone: ${formData.phone}\nClass: ${formData.class}\nMessage: ${formData.message}`
    
    const whatsappUrl = getWhatsAppLink('+919876543210', message)
    window.open(whatsappUrl, '_blank')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact & Admissions</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get in touch with us for admissions, inquiries, or any questions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-card">
            <h2 className="text-2xl font-bold mb-6">Admission Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Class *</label>
                <select
                  name="class"
                  required
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="">Select Class</option>
                  <option value="Class 8th">Class 8th</option>
                  <option value="Class 9th">Class 9th</option>
                  <option value="Class 10th">Class 10th</option>
                  <option value="Class 11th">Class 11th</option>
                  <option value="Class 12th">Class 12th</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="Any specific questions or requirements?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Send via WhatsApp
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4">
              * This will open WhatsApp with a pre-filled message. No data is stored on our servers.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-lg shadow-card">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Phone className="text-primary-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:+919876543210" className="text-gray-700 hover:text-primary-600">
                      +91-9876543210
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Mon-Sat, 8 AM - 8 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="text-primary-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:info@matrixcoaching.com" className="text-gray-700 hover:text-primary-600">
                      info@matrixcoaching.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="text-primary-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold mb-1">Our Locations</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      We have two branches in Delhi
                    </p>
                    <a href="/#locations" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                      View detailed addresses →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-600 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Office Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span className="font-semibold">9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
