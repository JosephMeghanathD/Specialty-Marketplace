import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CategoryCard from '../components/categories/CategoryCard';
import CategoryService from '../service/CategoryService';
import SkeletonLoader from '../components/ui/SkeletonLoader'; // Reuse skeleton loader
import { FaShapes, FaExclamationCircle } from 'react-icons/fa';
import '../styles/CategoriesPage.css';
import '../styles/SkeletonLoader.css'; // Ensure skeleton styles are available

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Using getCategoriesWithProducts to potentially get product counts
                const categoriesData = await CategoryService.getCategoriesWithProducts();

                // Format data for the card component
                const formattedCategories = categoriesData.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    description: cat.description,
                    // Attempt to get a representative image from the first product, or use a placeholder/icon logic
                    imageUrl: cat.products && cat.products.length > 0
                               ? cat.products[0].imageUrl // Use first product image
                               : `https://picsum.photos/seed/${cat.id + cat.name.length}/400/300`, // Placeholder image based on ID/name
                    productCount: cat.products ? cat.products.length : 0, // Calculate product count
                }));

                setCategories(formattedCategories);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("Could not load categories. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                // Show skeleton loaders matching the grid
                Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonLoader key={index} type="category" /> // You might need a 'category' type in SkeletonLoader CSS
                ))
            );
        }

        if (error) {
            return (
                <div className="categories-message error">
                    <FaExclamationCircle />
                    <p>{error}</p>
                </div>
            );
        }

        if (categories.length === 0) {
            return (
                <div className="categories-message empty">
                    <p>No categories found at the moment.</p>
                </div>
            );
        }

        return categories.map(category => (
            <CategoryCard key={category.id} category={category} />
        ));
    };

    return (
        <div className="page-container categories-page">
            <Navbar />
            <main className="categories-content-area">
                <div className="categories-header">
                    <h1><FaShapes /> Explore Our Categories</h1>
                    <p>Discover products grouped by interest.</p>
                </div>
                <div className="categories-grid">
                    {renderContent()}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CategoriesPage;