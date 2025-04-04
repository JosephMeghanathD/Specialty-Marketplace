import React from 'react';
import '../../styles/ProductsPage.css'; // Or a dedicated Sort component CSS

const ProductSort = ({ sortOption, onSortChange }) => {
    return (
        <div className="sort-container">
            <label htmlFor="sort-options">Sort by:</label>
            <select
                id="sort-options"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value)}
                className="sort-select"
            >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                 {/* Add more options like 'newest', 'rating' if available */}
            </select>
        </div>
    );
};

export default ProductSort;