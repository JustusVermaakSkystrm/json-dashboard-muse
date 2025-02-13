
import React from 'react';

const BrandLogo = () => {
  return (
    <div className="relative w-32 h-32">
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/29a6c924-ade5-4e6d-ad63-3cc07414722e.png" 
          alt="Gradient circle 1"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="absolute inset-0 mix-blend-overlay">
        <img 
          src="/lovable-uploads/7c166ebf-5f68-4e6d-bbae-aa49fbfe10cd.png" 
          alt="Gradient circle 2"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default BrandLogo;
