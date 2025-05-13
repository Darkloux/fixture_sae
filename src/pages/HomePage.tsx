import React, { useEffect } from 'react';
import Banner from '../components/home/Banner';
import FeaturedSection from '../components/home/FeaturedSection';
import NewsPreview from '../components/home/NewsPreview';

/**
 * Home page component
 * Main landing page for the website
 */
const HomePage: React.FC = () => {
  // Update the document title when the component mounts
  useEffect(() => {
    document.title = 'Deportivo SAE - Inicio';
  }, []);

  return (
    <div className="pt-16"> {/* Padding to account for fixed navbar */}
      <Banner />
      <FeaturedSection />
      <NewsPreview />
    </div>
  );
};

export default HomePage;