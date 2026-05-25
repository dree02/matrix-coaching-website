import { Feature } from '@/lib/types'
import { Users, Trophy, UserCheck, Monitor, ClipboardCheck, Users2 } from 'lucide-react'

interface FeaturesProps {
  features: Feature[]
}

const iconMap: Record<string, any> = {
  'users': Users,
  'trophy': Trophy,
  'user-check': UserCheck,
  'monitor': Monitor,
  'clipboard-check': ClipboardCheck,
  'users-2': Users2,
}

export default function Features({ features }: FeaturesProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose Matrix?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Users
            
            return (
              <div 
                key={index}
                className="p-6 rounded-lg border-2 border-gray-100 hover:border-primary-500 hover:shadow-card-hover transition-all"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-primary-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
