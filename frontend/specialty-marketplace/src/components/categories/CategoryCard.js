import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import '../../styles/CategoryCard.css';

// Helper to generate a consistent background color based on category name/ID
const generateBgColor = (id, name) => {
    const colors = ['#e0f7fa', '#e8f5e9', '#fff3e0', '#fce4ec', '#ede7f6', '#e3f2fd', '#f1f8e9', '#fffde7'];
    const hash = (id || 0) + name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
};


const CategoryCard = ({ category }) => {
    if (!category) return null;

    const {
        id,
        name = 'Unnamed Category',
        description = 'No description available.',
        imageUrl, // Use the one derived in CategoriesPage
        productCount = 0,
    } = category;

    const bgColor = generateBgColor(id, name);

    // Link to the products page, passing category ID as a query parameter
    // The ProductsPage component will need to be updated to read this parameter
    const categoryLink = `/products?category=${id}`;

    return (
        <Link to={categoryLink} className="category-card-item-link">
            <div className="category-card-item">
                <div className="category-image-container" style={{ backgroundColor: bgColor }}>
                    {imageUrl ? (
                        <img src={imageUrl} alt={name} className="category-image" loading="lazy" />
                    ) : (
                        <div className="category-image-placeholder">
                             {/* Display first letter as fallback icon */}
                            <span>{name.charAt(0).toUpperCase()}</span>
                        </div>
                    )}
                     <span className="category-product-count">{productCount} Product{productCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="category-info">
                    <h3 className="category-name">{name}</h3>
                    <p className="category-description">
                        {description.length > 60 ? `${description.substring(0, 60)}...` : description}
                    </p>
                     <span className="category-view-link">
                        Shop Now <FaArrowRight />
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;