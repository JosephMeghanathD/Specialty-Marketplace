import React from 'react';
import ProductCard from './ProductCard'; // Assuming you have this component
import SkeletonLoader from '../ui/SkeletonLoader';
import { FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/ProductGrid.css';

const ProductGrid = ({ products, isLoading, error }) => {

    if (error) {
        return (
            <div className="product-grid-message error">
                <FaExclamationTriangle />
                <p>{error}</p>
                <p>Please try refreshing the page.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="product-grid loading">
                {/* Render skeleton loaders */}
                {Array.from({ length: 8 }).map((_, index) => (
                    <SkeletonLoader key={index} type="product" />
                ))}
            </div>
        );
    }

    if (!isLoading && products.length === 0) {
        return (
             <div className="product-grid-message empty">
                <p>No products found matching your criteria.</p>
                <p>Try adjusting your filters.</p>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;