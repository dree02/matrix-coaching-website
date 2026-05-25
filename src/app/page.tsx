import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import LocationMap from '@/components/home/LocationMap'
import { getCenterInfo, getRecentTestimonials } from '@/lib/data-fetchers'

export default async function Home() {
  const centerInfo = await getCenterInfo()
  const testimonials = await getRecentTestimonials(6)

  return (
    <>
      <Hero info={centerInfo} />
      <Features features={centerInfo.keyFeatures} />
      
      {/* Quick Branches Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Locations</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {centerInfo.branches.map((branch) => (
              <div key={branch.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-primary-500 transition-colors">
                <h3 className="text-xl font-bold mb-2">{branch.name}</h3>
                <p className="text-gray-600 mb-4">
                  {branch.address.area}, {branch.address.city}
                </p>
                <a
                  href={branch.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  View on Map →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">&quot;{testimonial.comment}&quot;</p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.relation}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LocationMap info={centerInfo} />
    </>
  )
}
