import React from 'react';

const ShimmerConnections = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex items-center gap-3 p-4 animate-pulse border-b border-base-200">
          <div className="w-12 h-12 bg-base-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-base-300 rounded w-1/2"></div>
            <div className="h-3 bg-base-300 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerConnections;
