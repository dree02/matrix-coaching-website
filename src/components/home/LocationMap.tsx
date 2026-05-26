import { CenterInfo } from '@/lib/types'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

interface LocationMapProps {
  info: CenterInfo
}

export default function LocationMap({ info }: LocationMapProps) {
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">{branch.name}</h3>
                {branch.isPrimary && (
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Main Branch
                  </span>
                )}
              </div>

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
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224.${branch.id === 'branch-shalimar' ? '09876543210' : '12345678901'}!2d77.${branch.id === 'branch-shalimar' ? '379' : '380'}!3d28.${branch.id === 'branch-shalimar' ? '681' : '682'}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDQwJzUyLjIiTiA3N8KwMjInNDMuMiJF!5e0!3m2!1sen!2sin!4v1234567890`}
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
                <a href={`tel:${info.contact.phone}`} className="text-gray-700 hover:text-primary-600">
                  {info.contact.phone}
                </a>
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
                <h4 className="font-semibold text-lg mb-1">Office Hours</h4>
                <p className="text-gray-700 text-sm">
                  {info.operatingHours.weekdays}<br />
                  {info.operatingHours.weekends}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
