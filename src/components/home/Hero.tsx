import Link from 'next/link'
import { CenterInfo } from '@/lib/types'
import { ArrowRight, Phone } from 'lucide-react'

interface HeroProps {
  info: CenterInfo
}

export default function Hero({ info }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
            {info.name}
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-primary-100">
            {info.tagline}
          </p>
          <p className="text-lg mb-8 text-primary-50">
            {info.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/schedules"
              className="inline-flex items-center justify-center bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              View Schedules & Fees
              <ArrowRight className="ml-2" size={20} />
            </Link>
            
            <a 
              href={`tel:${info.contact.phone}`}
              className="inline-flex items-center justify-center border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              <Phone className="mr-2" size={20} />
              Call Now
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            <div>
              <div className="text-3xl font-bold">{info.established}</div>
              <div className="text-primary-100">Established</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{info.totalStudents}+</div>
              <div className="text-primary-100">Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-primary-100">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
