import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductService from '../service/ProductService';
import ProductGrid from '../components/products/ProductGrid';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { useCart } from '../context/CartContext'; // Import useCart
import { FaStar, FaShoppingCart, FaHeart, FaTag, FaExclamationTriangle, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import '../styles/ProductDetailPage.css';
import '../styles/SkeletonLoader.css';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const { addItem } = useCart(); // Get addItem function from CartContext

    const [product, setProduct] = useState(null);
    const [popularInCategory, setPopularInCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPopular, setIsLoadingPopular] = useState(false);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            if (!productId || isNaN(parseInt(productId))) {
                 setError("Invalid Product ID provided in URL.");
                 setIsLoading(false);
                 return;
             }

            setIsLoading(true);
            setIsLoadingPopular(false);
            setError(null);
            setProduct(null);
            setPopularInCategory([]);

            let fetchedProductData = null;

            try {
                console.log(`Fetching main product: ${productId}`);
                fetchedProductData = await ProductService.getProductById(productId);
                setProduct(fetchedProductData);
                console.log("Main product fetched:", fetchedProductData);

            } catch (err) {
                console.error(`Failed to fetch product detail for ID ${productId}:`, err);
                if (err.response && err.response.status === 404) {
                    setError(`Sorry, we couldn't find a product with ID ${productId}.`);
                } else {
                    setError("An error occurred while loading product details. Please try again.");
                }
                setProduct(null);
                setIsLoading(false);
                return;
            }

            const categoryId = fetchedProductData?.category?.id;

            if (categoryId) {
                setIsLoadingPopular(true);
                console.log(`Main product has category ID: ${categoryId}. Fetching popular products...`);
                try {
                    const popularData = await ProductService.getPopularProductsByCategory(categoryId);
                    console.log("Raw popular data fetched:", popularData);
                    const filteredPopular = popularData.filter(p => p.id !== fetchedProductData.id);
                    console.log("Filtered popular data:", filteredPopular);
                    setPopularInCategory(filteredPopular);
                } catch (popularError) {
                    console.error(`Failed to fetch popular products for category ${categoryId}:`, popularError);
                    setPopularInCategory([]);
                } finally {
                    setIsLoadingPopular(false);
                }
            } else {
                console.warn(`Product ${productId} has no category ID. Cannot fetch popular related products.`);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [productId]);

    const handleQuantityChange = (change) => {
        setQuantity(prev => {
            const newQuantity = prev + change;
            if (newQuantity < 1) return 1;
            const maxStock = product?.stockQuantity ?? Infinity;
            if (newQuantity > maxStock) return maxStock > 0 ? maxStock : 1;
            return newQuantity;
        });
    };

    const handleAddToCart = () => {
        if (!product || product.stockQuantity <= 0) return;
        console.log(`Adding ${quantity} of ${product.name} (ID: ${productId}) to cart from DetailPage`);
        const productToAdd = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            discount: product.discount,
            stockQuantity: product.stockQuantity // Include stock for potential checks in cart
        };
        addItem(productToAdd, quantity);
        // Optionally add user feedback (e.g., toast notification)
    };

    const handleAddToWishlist = () => {
         if (!product) return;
        console.log(`Adding ${product.name} (ID: ${productId}) to wishlist.`);
        // Add wishlist logic here
    };

    const formatCurrency = (amount) => {
        return `$${(Number(amount) || 0).toFixed(2)}`;
    };

    const renderRatingStars = (ratingValue) => {
        const stars = [];
        const rating = Number(ratingValue) || 0;
        const fullStars = Math.floor(rating);
        for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} className="star-icon filled" />);
        const emptyStars = 5 - fullStars;
        for (let i = 0; i < emptyStars; i++) stars.push(<FaStar key={`empty-${i}`} className="star-icon empty" />);
        return stars;
    };

    const renderLoading = () => (
         <div className="product-detail-loading">
            <SkeletonLoader type="product-detail-image" />
            <SkeletonLoader type="product-detail-info" />
         </div>
    );

    const renderError = () => (
        <div className="product-detail-message error">
            <FaExclamationTriangle />
            <p>{error}</p>
            <Link to="/products" className="back-link"><FaArrowLeft /> Back to Products</Link>
        </div>
    );

    if (isLoading) {
        return (
            <div className="page-container product-detail-page">
                <Navbar />
                <main className="product-detail-content-area">
                    {renderLoading()}
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="page-container product-detail-page">
                <Navbar />
                <main className="product-detail-content-area">
                    {renderError()}
                </main>
                <Footer />
            </div>
        );
    }

    const { name, description, price, imageUrl, category, stockQuantity, rating, discount = 0 } = product;
    const currentPrice = price * (1 - discount / 100);
    const hasDiscount = discount > 0;
    const isInStock = stockQuantity > 0;
    const categoryName = category?.name || 'General';
    const categoryId = category?.id;

    return (
        <div className="page-container product-detail-page">
            <Navbar />
            <main className="product-detail-content-area">
                 <div className="breadcrumb-nav">
                     <Link to="/products">Products</Link> /
                     {categoryId && <Link to={`/products?category=${categoryId}`}>{categoryName}</Link>}
                     {categoryId && ' / '}
                     <span>{name}</span>
                 </div>

                <section className="product-main-section">
                    <div className="product-gallery">
                        <img src={imageUrl || 'https://via.placeholder.com/600x600?text=No+Image'} alt={name} className="main-product-image"/>
                         {hasDiscount && <span className="detail-discount-badge">-{discount}% OFF</span>}
                    </div>

                    <div className="product-info-actions">
                         {categoryId && (
                             <Link to={`/products?category=${categoryId}`} className="product-info-category">
                                <FaTag /> {categoryName}
                            </Link>
                         )}
                        <h1 className="product-info-name">{name}</h1>

                        {rating && (
                            <div className="product-info-rating">
                                {renderRatingStars(rating)}
                                <span>({Number(rating).toFixed(1)})</span>
                            </div>
                        )}

                        <div className="product-info-price">
                            <span className="current-detail-price">{formatCurrency(currentPrice)}</span>
                            {hasDiscount && (
                                <span className="original-detail-price">{formatCurrency(price)}</span>
                            )}
                        </div>

                        <p className="product-info-short-desc">
                            {description?.substring(0, 150)}{description?.length > 150 ? '...' : ''}
                        </p>

                         <div className={`product-info-stock ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
                            {isInStock ? <FaCheckCircle /> : <FaTimesCircle />}
                            <span>{isInStock ? `In Stock (${stockQuantity} available)` : 'Out of Stock'}</span>
                         </div>

                        <div className="product-actions">
                            <div className="quantity-selector">
                                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
                                <input type="number" value={quantity} readOnly />
                                <button onClick={() => handleQuantityChange(1)} disabled={!isInStock || quantity >= stockQuantity}>+</button>
                            </div>
                            <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={!isInStock}>
                                <FaShoppingCart /> Add to Cart
                            </button>
                        </div>
                        <button className="add-to-wishlist-btn" onClick={handleAddToWishlist}>
                           <FaHeart /> Add to Wishlist
                        </button>
                    </div>
                </section>

                 {description && (
                     <section className="product-description-section">
                        <h2>Product Description</h2>
                        <div className="description-content">
                            <p>{description}</p>
                         </div>
                    </section>
                 )}

                 {categoryId && (
                     <section className="related-products-section">
                         <h2>Popular in {categoryName}</h2>
                         {isLoadingPopular && (
                             <div className="related-loading">
                                 <SkeletonLoader type="product" count={4} />
                             </div>
                         )}
                         {!isLoadingPopular && popularInCategory.length > 0 && (
                            <ProductGrid
                                products={popularInCategory}
                                isLoading={false}
                                error={null}
                                gridType="related"
                            />
                         )}
                         {!isLoadingPopular && popularInCategory.length === 0 && (
                            <p className="no-related-products">No other popular products found in this category right now.</p>
                         )}
                    </section>
                 )}

            </main>
            <Footer />
        </div>
    );
};

export default ProductDetailPage;