import React from 'react';
import '../../styles/SkeletonLoader.css';

const SkeletonLoader = ({ type = 'product', count = 1 }) => {
    const renderSkeleton = (key) => {
        switch (type) {
            case 'product':
                return (
                    <div className="skeleton skeleton-product-card" key={key}>
                        <div className="skeleton skeleton-image"></div>
                        <div className="skeleton skeleton-text skeleton-title"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text skeleton-price"></div>
                         <div className="skeleton skeleton-button"></div>
                    </div>
                );
            case 'text':
                return <div className="skeleton skeleton-text" key={key}></div>;
            case 'title':
                 return <div className="skeleton skeleton-text skeleton-title" key={key}></div>;
             case 'avatar':
                 return <div className="skeleton skeleton-avatar" key={key}></div>;
            default:
                return <div className="skeleton" key={key}></div>;
        }
    };

    return (
        <>
            {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
        </>
    );
};

export default SkeletonLoader;