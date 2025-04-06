import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-32"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              Keep Our Campus Clean
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Join our initiative to maintain a clean and healthy campus environment. Report waste, earn rewards, and make a difference.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">How it works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Make our campus better together
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <Link to="/upload" >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <Camera className="h-6 w-6" />
                </div>
                </Link>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Upload Photos</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Snap and upload pictures of waste or garbage you find around campus.
                  </p>
                </div>
              </div>

              <div className="relative">
                <Link to='/upload' >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <MapPin className="h-6 w-6" />
                </div>
                </Link>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Mark Location</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Add the location details to help our cleaning team locate and address the issue.
                  </p>
                </div>
              </div>

              <div className="relative">
                <Link to='/profile' >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <Award className="h-6 w-6" />
                </div>
                </Link>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Earn Rewards</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get points for your contributions and redeem them for exciting rewards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;