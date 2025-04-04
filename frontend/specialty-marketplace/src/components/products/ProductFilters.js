import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import '../../styles/ProductFilters.css';

// Basic Range Slider (Consider using a library like 'rc-slider' for better UX)
const RangeSlider = ({ min, max, value, onChange }) => {
    const handleMinChange = (e) => {
        const newMin = Math.min(Number(e.target.value), value[1] - 1); // Ensure min < max
        onChange([newMin, value[1]]);
    };

    const handleMaxChange = (e) => {
        const newMax = Math.max(Number(e.target.value), value[0] + 1); // Ensure max > min
        onChange([value[0], newMax]);
    };

    return (
        <div className="range-slider">
             <div className="range-inputs">
                 <span>${value[0]}</span>
                 <span>${value[1]}</span>
             </div>
            <div className="slider-track">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value[0]}
                    onChange={handleMinChange}
                    className="thumb thumb-left"
                    aria-label="Minimum price"
                 />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value[1]}
                    onChange={handleMaxChange}
                    className="thumb thumb-right"
                    aria-label="Maximum price"
                />
                 <div className="slider-inner-track" style={{ left: `${(value[0]/max)*100}%`, right: `${100 - (value[1]/max)*100}%` }}></div>
             </div>

        </div>
    );
};


const ProductFilters = ({ categories, activeFilters, onFilterChange, maxPrice }) => {
    const [searchTerm, setSearchTerm] = useState(activeFilters.searchTerm || '');
    const [priceRange, setPriceRange] = useState(activeFilters.priceRange);

    // Update internal state if props change (e.g., maxPrice is determined after initial render)
    useEffect(() => {
         setPriceRange(activeFilters.priceRange);
    }, [activeFilters.priceRange]);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm !== activeFilters.searchTerm) {
               onFilterChange({ searchTerm: searchTerm });
            }
        }, 500); // Update after 500ms of inactivity

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, onFilterChange, activeFilters.searchTerm]);


     const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryClick = (categoryId) => {
        onFilterChange({ category: categoryId });
    };

    const handlePriceChange = (newRange) => {
         setPriceRange(newRange);
        // Optionally debounce this as well if slider is laggy
        onFilterChange({ priceRange: newRange });
    };

     const clearFilters = () => {
        setSearchTerm('');
        setPriceRange([0, maxPrice]);
        onFilterChange({
            category: 'all',
            priceRange: [0, maxPrice],
            searchTerm: '',
        });
    };


    return (
        <div className="filters-container">
            <h3>Filters</h3>

             {/* Search Filter */}
            <div className="filter-group search-filter">
                <label htmlFor="search-filter">Search Products</label>
                <div className="search-input-wrapper">
                     <FaSearch className="search-icon" />
                    <input
                        type="text"
                        id="search-filter"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                    />
                </div>
            </div>


            {/* Category Filter */}
            <div className="filter-group">
                <label>Category</label>
                <ul className="category-filter-list">
                    <li
                        className={activeFilters.category === 'all' ? 'active' : ''}
                        onClick={() => handleCategoryClick('all')}
                    >
                        All Categories
                    </li>
                    {categories.map(cat => (
                        <li
                            key={cat.id}
                            className={activeFilters.category === cat.id.toString() ? 'active' : ''}
                            onClick={() => handleCategoryClick(cat.id.toString())}
                        >
                            {cat.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
                <label>Price Range</label>
                <RangeSlider
                    min={0}
                    max={maxPrice}
                    value={priceRange}
                    onChange={handlePriceChange}
                />
                 <div className="price-display">
                    Price: ${priceRange[0]} - ${priceRange[1]}
                 </div>
            </div>

              {/* Clear Filters Button */}
            <button className="clear-filters-btn" onClick={clearFilters}>
                <FaTimes /> Clear All Filters
            </button>

            {/* Add more filters here (e.g., rating, brand, etc.) */}
        </div>
    );
};

export default ProductFilters;