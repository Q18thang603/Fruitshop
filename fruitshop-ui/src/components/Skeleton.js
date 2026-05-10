import React from 'react';
import '../styles/skeleton.css';

export default function Skeleton({ type = 'card', count = 1 }) {
  const renderSkeleton = () => {
    switch(type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton skeleton-img"></div>
            <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
            <div className="skeleton-btn-circle"></div>
          </div>
        );
      case 'text':
        return <div className="skeleton skeleton-text"></div>;
      default:
        return <div className="skeleton skeleton-rect"></div>;
    }
  };

  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} style={{ width: '100%', height: '100%' }}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}
