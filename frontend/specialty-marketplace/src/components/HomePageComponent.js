import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Make sure useNavigate is imported
import {
    FaArrowRight, FaSearch, FaStar, FaFire, FaTags,
    FaExclamationCircle
} from 'react-icons/fa';
import ProductService from '../service/ProductService';
import CategoryService from '../service/CategoryService';
import ProductGrid from './products/ProductGrid'; // Assuming ProductGrid component exists
import SkeletonLoader from '../components/ui/SkeletonLoader'; // Assuming SkeletonLoader exists
import '../styles/HomePage.css'; // Main styles for the page
import '../styles/SkeletonLoader.css'; // Ensure skeleton styles are available

// Helper function to map category names to icons (customize as needed)
const getCategoryIcon = (categoryName) => {
    const iconMap = {
        'Food & Beverages': '🍽️',
        'Accessories': '👜',
        'Home & Decor': '🏠',
        'Health & Wellness': '💆',
        'Art & Crafts': '🎨',
        'Tech Gadgets': '🔌',
        'Default': '🏷️' // Default icon
    };
    return iconMap[categoryName] || iconMap['Default'];
};

const HomePageComponent = () => {
    // --- State Hooks ---
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    // --- Helper Function to Format Product Data ---
    const formatProduct = (product) => {
        // Add fallback rating calculation if needed (replace with actual data when available)
        const averageRating = product.rating || (4.0 + Math.random() * 1.0).toFixed(1);
        // Add fallback discount if needed
        const discount = product.discount || 0;

        return {
            id: product.id,
            name: product.name || 'Unnamed Product',
            description: product.description || '',
            price: parseFloat(product.price) || 0,
            // Use backend image URL or a consistent placeholder based on ID
            imageUrl: product.imageUrl || `https://picsum.photos/seed/${product.id}/300/200`,
            rating: averageRating,
            // Handle potential diff backend structures for category {id, name} vs categoryId
            category: product.categoryDto || product.category,
            discount: discount,
        };
    };

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch categories, featured, and popular products concurrently
                const [categoriesData, featuredData, popularData] = await Promise.all([
                    CategoryService.getCategoriesWithProducts(), // Fetches categories potentially with product counts
                    ProductService.getFeaturedProducts(),
                    ProductService.getPopularProducts() // Fetch popular products
                ]);

                // Format categories for display
                const formattedCategories = categoriesData.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    icon: getCategoryIcon(cat.name),
                    count: cat.products ? cat.products.length : 0 // Product count might be useful elsewhere
                }));
                setCategories(formattedCategories);

                // Format and set featured products
                setFeaturedProducts(featuredData.map(formatProduct));

                // Format and set popular products
                setPopularProducts(popularData.map(formatProduct));

                console.log("Homepage data fetched successfully");

            } catch (err) {
                console.error('Failed to fetch homepage data:', err);
                // Set a user-friendly error message
                setError('Oops! We couldn\'t load all products right now. Please try refreshing.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs only once on mount

    // --- Event Handler for Search Submission ---
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        // Navigate to products page with search query
        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    };

    // --- Render Logic ---
    return (
        <div className="home-page">
            {/* === Hero Section === */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Discover Unique Specialty Products</h1>
                    <p>Curated collection of handpicked items from artisans around the world</p>
                    <form className="hero-search" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="What are you looking for?"
                            className="hero-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="hero-search-button" type="submit">
                            <FaSearch />
                            <span>Search</span>
                        </button>
                    </form>
                    <div className="hero-cta">
                        <Link to="/products" className="hero-cta-button">
                            <span>Browse All Products</span>
                            <FaArrowRight />
                        </Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="https://picsum.photos/600/400" alt="Artisan crafts and products collage" />
                </div>
            </section>

            {/* === Global Error Message Display Area === */}
            {error && !isLoading && (
                <div className="homepage-error-message">
                    <FaExclamationCircle /> {error}
                </div>
            )}

            {/* === Categories Display Section (Navigational) === */}
            <section className="categories-section">
                <div className="section-header">
                    <h2><FaTags /> Browse By Category</h2>
                    <Link to="/categories" className="view-all-link">
                        View All Categories <FaArrowRight />
                    </Link>
                </div>
                {isLoading ? (
                    <div className="category-cards-container loading">
                        {/* Adjust skeleton count as needed */}
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonLoader key={`cat-skel-${i}`} type="category-card-small" />)}
                    </div>
                ) : categories.length > 0 ? (
                    <div className="category-cards-container">
                        {/* Show a limited number of categories + View All link */}
                        {categories.slice(0, 5).map(category => (
                            <Link to={`/products?category=${category.id}`} key={category.id} className="category-card-link">
                                <div className="category-card-small">
                                    <span className="category-icon">{category.icon}</span>
                                    <h3>{category.name}</h3>
                                </div>
                            </Link>
                        ))}
                        <Link to="/categories" className="category-card-link">
                            <div className="category-card-small view-all">
                                <span className="category-icon"><FaArrowRight /></span>
                                <h3>View All</h3>
                            </div>
                        </Link>
                    </div>
                ) : !error ? (
                    // Only show if not loading and no previous error
                    <p>No categories available right now.</p>
                ) : null /* Don't show anything here if error is displayed globally */}
            </section>

            {/* === Wrapper for Side-by-Side Product Sections === */}
            <div className="side-by-side-products">

                {/* --- Featured Products Section --- */}
                <section className="featured-products-section product-section">
                    <div className="section-header">
                        <h2><FaStar /> Featured</h2> {/* Keep titles concise */}
                        <Link to="/products?sort=featured" className="view-all-link">
                            View All <FaArrowRight />
                        </Link>
                    </div>
                    {/* ProductGrid handles internal loading/empty/error based on props */}
                    <ProductGrid
                        products={featuredProducts}
                        isLoading={isLoading} // Pass global loading state
                        error={null} // Assume error is handled globally for the page load
                        gridType="homepage" // Optional prop for styling hints
                    />
                </section>

                {/* --- Popular Products Section --- */}
                <section className="popular-products-section product-section">
                    <div className="section-header">
                        <h2><FaFire /> Popular</h2> {/* Keep titles concise */}
                        <Link to="/products?sort=popular" className="view-all-link">
                            View All <FaArrowRight />
                        </Link>
                    </div>
                     {/* ProductGrid handles internal loading/empty/error based on props */}
                    <ProductGrid
                        products={popularProducts}
                        isLoading={isLoading} // Pass global loading state
                        error={null} // Assume error is handled globally for the page load
                        gridType="homepage"
                    />
                </section>

            </div> {/* === End Side-by-Side Wrapper === */}


            {/* === Promotional Banner Section === */}
            <section className="promo-banner">
                <div className="promo-content">
                    <h2>Special Offer</h2>
                    <p>Join our membership program and get 15% off your first order!</p>
                    <Link to="/register" className="promo-button">Sign Up Now</Link>
                </div>
            </section>

            {/* === Testimonials Section === */}
            <section className="testimonials-section">
                <div className="section-header">
                    <h2>What Our Customers Say</h2>
                </div>
                <div className="testimonials-container">
                    {/* Example static testimonials - replace with dynamic data if needed */}
                    {[
                        { id: 1, name: "Sarah J.", text: "The quality of products I've received has been exceptional. Love the unique selection!", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
                        { id: 2, name: "Michael T.", text: "Fast shipping and excellent customer service. Will definitely be ordering again soon.", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
                        { id: 3, name: "Emily R.", text: "Found items here that I couldn't find anywhere else. The artisan coffee beans are amazing!", avatar: "https://randomuser.me/api/portraits/women/32.jpg" }
                    ].map(testimonial => (
                        <div className="testimonial-card" key={testimonial.id}>
                            <div className="testimonial-content"><p>"{testimonial.text}"</p></div>
                            <div className="testimonial-author">
                                <img src={testimonial.avatar} alt={testimonial.name} />
                                <span>{testimonial.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* === Newsletter Signup Section === */}
            <section className="newsletter-section">
                <div className="newsletter-content">
                    <h2>Stay Updated</h2>
                    <p>Subscribe to our newsletter for new product announcements and exclusive offers</p>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Your email address" required />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default HomePageComponent;