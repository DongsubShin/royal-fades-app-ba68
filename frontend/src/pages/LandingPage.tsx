import React from 'react';
import UserLayout from '../components/layout/UserLayout';
import { Crown, Clock, Star, Scissors } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <UserLayout>
      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 lg:pt-48 lg:pb-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-900 mb-4">
                <Crown size={16} className="mr-2" />
                Premium Grooming Experience
              </span>
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                Precision Cuts for the <span className="text-[#ED1C24]">Modern Gentleman</span>
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Experience the art of grooming at Royal Fades. From classic tapers to modern skin fades, our master barbers ensure you leave looking your absolute best.
              </p>
              <div className="mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                <button className="bg-[#ED1C24] text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg">
                  Book Appointment
                </button>
                <button className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-md font-bold text-lg hover:bg-slate-50 transition-all">
                  View Live Queue
                </button>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-2xl overflow-hidden">
                <img
                  className="w-full"
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800"
                  alt="Barber shop interior"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Our Services</h2>
            <div className="w-20 h-1 bg-[#ED1C24] mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Royal Fade', price: '$35', desc: 'Precision fade with hot towel finish' },
              { name: 'Beard Sculpting', price: '$25', desc: 'Shape, trim and straight razor line-up' },
              { name: 'The Full Service', price: '$55', desc: 'Haircut, beard trim, and charcoal mask' }
            ].map((service) => (
              <div key={service.name} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:border-[#ED1C24] transition-colors">
                <Scissors className="text-[#ED1C24] mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-slate-500 mb-4">{service.desc}</p>
                <p className="text-2xl font-bold text-slate-900">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </UserLayout>
  );
};

export default LandingPage;