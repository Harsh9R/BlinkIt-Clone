import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import banner from '../assets/banner.jpg';
import bannerMobile from '../assets/banner-mobile.jpg';
import minuteDelivery from '../assets/minute_delivery.png';
import bestPrices from '../assets/Best_Prices_Offers.png';
import wideAssortment from '../assets/Wide_Assortment.png';

// Banner data
const bannerData = [
  {
    id: 1,
    image: minuteDelivery,
    mobileImage: minuteDelivery,
    title: 'Lightning Fast Delivery',
    subtitle: 'Get your orders delivered in minutes',
    cta: 'Order Now'
  },
  {
    id: 2,
    image: bestPrices,
    mobileImage: bestPrices,
    title: 'Best Prices & Offers',
    subtitle: 'Save big on your favorite products',
    cta: 'View Deals'
  },
  {
    id: 3,
    image: wideAssortment,
    mobileImage: wideAssortment,
    title: 'Wide Selection',
    subtitle: 'Choose from thousands of products',
    cta: 'Explore'
  }
];

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide, isTransitioning]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % bannerData.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + bannerData.length) % bannerData.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index) => {
    if (index !== currentSlide) {
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  return (
    <div className="relative w-full h-full min-h-44 max-h-60 bg-blue-100 rounded-lg overflow-hidden shadow-lg my-3">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerData.map((slide, index) => (
          <div 
            key={slide.id} 
            className="w-full flex-shrink-0 relative h-full"
          >
            {/* Desktop Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full hidden lg:block object-cover object-center"
            />
            {/* Mobile Image */}
            <img
              src={slide.mobileImage}
              alt={slide.title}
              className="w-full h-full lg:hidden object-cover object-center"
            />
            
            {/* Overlay Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-30 p-3">
              <h2 className="text-xl md:text-2xl font-bold mb-1 text-center">{slide.title}</h2>
              <p className="text-sm md:text-base mb-2 text-center">{slide.subtitle}</p>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1 rounded-full transition-colors text-sm">
                {slide.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 p-1.5 rounded-full text-gray-800 transition-all"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={18} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 p-1.5 rounded-full text-gray-800 transition-all"
        aria-label="Next slide"
      >
        <FaChevronRight size={18} />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
        {bannerData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider; 