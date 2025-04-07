import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="card p-6 flex flex-col items-start">
      <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
        <div className="text-primary-600 dark:text-primary-400">
          {icon}
        </div>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard; 