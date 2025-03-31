import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaSearch, FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
import '../styles/HomePage.css';
import ProductService from '../service/ProductService';
import CategoryService from '../service/CategoryService';


const HomePageComponent = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  
  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories first
        const categoriesData = await CategoryService.getCategoriesWithProducts();
      
        
        // Format categories to match UI requirements
        const formattedCategories = categoriesData.map(category => ({
          id: category.id,
          name: category.name, 
          icon: getCategoryIcon(category.name), // Helper function to map category names to icons
          count: category.products ? category.products.length : 0
        }));
        
        setCategories(formattedCategories);
        
        // Fetch featured products
        const productsData = await ProductService.getFeaturedProducts();
        
        // Format products to match UI requirements
        const formattedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          image: product.imageUrl || '/api/placeholder/300/300',
          rating: calculateAverageRating(product), // Assuming we'd have a rating system
          category: product.categoryDto ? product.categoryDto.id : null,
          discount: calculateDiscount(product) // Helper to calculate discount if applicable
        }));
        
        setFeaturedProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
        console.log("Home Products Fetched successful") // Initially set filtered products to all featured products
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Update filtered products when active category changes
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProducts(featuredProducts);
    } else {
      const filtered = featuredProducts.filter(product => 
        product.category === parseInt(activeCategory)
      );
      setFilteredProducts(filtered);
    }
  }, [activeCategory, featuredProducts]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle search form submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await ProductService.searchProducts(searchQuery);
      
      // Format search results
      const formattedResults = results.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        image: product.imageUrl || '/api/placeholder/300/300',
        rating: calculateAverageRating(product),
        category: product.category ? product.category.id : null,
        discount: calculateDiscount(product)
      }));
      
      setFilteredProducts(formattedResults);
      setActiveCategory('all'); // Reset category filter when searching
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to search products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to map category names to icons
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Food & Beverages': '🍽️',
      'Accessories': '👜',
      'Home & Decor': '🏠',
      'Health & Wellness': '💆',
      'Art & Crafts': '🎨',
      'Tech Gadgets': '🔌'
    };
    
    // Return the matching icon or a default
    return iconMap[categoryName] || '🛒';
  };
  
  // Helper function to calculate average rating
  const calculateAverageRating = (product) => {
    // This would be replaced with actual rating logic from the API
    // Just returning a random rating between 4.5 and 5.0 for now
    return (4.5 + Math.random() * 0.5).toFixed(1);
  };
  
  // Helper function to calculate discount
  const calculateDiscount = (product) => {
    // This would be replaced with actual discount logic from the API
    // Just returning a random discount for now (0, 10, or 15)
    const discountOptions = [0, 0, 0, 10, 15];
    return discountOptions[Math.floor(Math.random() * discountOptions.length)];
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
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
              onChange={handleSearchChange}
            />
            <button className="hero-search-button" type="submit">
              <FaSearch />
              <span>Search</span>
            </button>
          </form>
          <div className="hero-cta">
            <Link to="/products" className="hero-cta-button">
              <span>Browse All</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://fastly.picsum.photos/id/28/600/400.jpg?hmac=eQjcdjM_-BFk1bwAfqeR9RHqYMOC05XZC1TLCpkg04Y" alt="Featured products collage" />
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Explore Categories</h2>
          <Link to="/products" className="view-all-link">
            View All <FaArrowRight />
          </Link>
        </div>
        <div className="categories-container">
          {isLoading ? (
            <div className="loading-skeleton categories-skeleton"></div>
          ) : (
            <>
              <div 
                className={`category-card ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                <div className="category-icon">🛒</div>
                <h3>All Products</h3>
                <p>{featuredProducts.length}+ items</p>
              </div>
              {categories.map(category => (
                <div 
                  key={category.id}
                  className={`category-card ${activeCategory === category.id.toString() ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id.toString())}
                >
                  <div className="category-icon">{category.icon}</div>
                  <h3>{category.name}</h3>
                  <p>{category.count}+ items</p>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>
            {activeCategory === 'all' 
              ? 'Featured Products' 
              : categories.find(c => c.id.toString() === activeCategory)?.name || 'Products'}
          </h2>
          <Link to="/products" className="view-all-link">
            View All <FaArrowRight />
          </Link>
        </div>
        <div className="products-grid">
          {isLoading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="loading-skeleton product-skeleton"></div>
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="no-products-message">
              <p>No products found. Try another category or search term.</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div className="product-card" key={product.id}>
                {product.discount > 0 && (
                  <div className="product-badge">-{product.discount}%</div>
                )}
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-actions">
                    <button className="action-btn wishlist">
                      <FaHeart />
                    </button>
                    <button className="action-btn cart">
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-meta">
                    <div className="product-rating">
                      <FaStar />
                      <span>{product.rating}</span>
                    </div>
                    <div className="product-price">
                      {product.discount > 0 && (
                        <span className="original-price">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                      <span className="current-price">
                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Link to={`/products/${product.id}`} className="product-link">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>Special Offer</h2>
          <p>Join our membership program and get 15% off your first order!</p>
          <Link to="/register" className="promo-button">
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Our Customers Say</h2>
        </div>
        <div className="testimonials-container">
          {
          [
            {
              "id": 1,
              "name": "Sarah J.",
              "text": "The quality of products I've received has been exceptional. Love the unique selection!",
              "avatar": "https://randomuser.me/api/portraits/women/45.jpg"
            },
            {
              "id": 2,
              "name": "Michael T.",
              "text": "Fast shipping and excellent customer service. Will definitely be ordering again soon.",
              "avatar": "https://randomuser.me/api/portraits/men/22.jpg"
            },
            {
              "id": 3,
              "name": "Emily R.",
              "text": "Found items here that I couldn't find anywhere else. The artisan coffee beans are amazing!",
              "avatar": "https://randomuser.me/api/portraits/women/32.jpg"
            }
          ].map(testimonial => (
            <div className="testimonial-card" key={testimonial.id}>
              <div className="testimonial-content">
                <p>"{testimonial.text}"</p>
              </div>
              <div className="testimonial-author">
                <img src={testimonial.avatar} alt={testimonial.name} />
                <span>{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Newsletter Signup */}
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