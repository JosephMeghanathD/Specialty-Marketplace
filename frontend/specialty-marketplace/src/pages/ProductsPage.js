import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductFilters from '../components/products/ProductFilters';
import ProductGrid from '../components/products/ProductGrid';
import ProductSort from '../components/products/ProductSort';
import ProductService from '../service/ProductService';
import CategoryService from '../service/CategoryService';
import '../styles/ProductsPage.css';
import { FaFilter } from 'react-icons/fa';

const ProductsPage = () => {
    // --- Hooks ---
    const [searchParams, setSearchParams] = useSearchParams(); // Hook to manage URL search params

    // --- State ---
    const [allProducts, setAllProducts] = useState([]); // Original fetched list
    const [filteredProducts, setFilteredProducts] = useState([]); // List to display
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize filter state directly from URL parameters on initial render
    const [activeFilters, setActiveFilters] = useState(() => {
        const initialCategory = searchParams.get('category') || 'all';
        const initialMinPrice = parseInt(searchParams.get('minPrice') || '0', 10);
        // Max price default needs to be high initially, will be refined after data load
        const initialMaxPrice = parseInt(searchParams.get('maxPrice') || '9999', 10);
        const initialSearch = searchParams.get('search') || '';

        return {
            category: initialCategory,
            priceRange: [initialMinPrice, initialMaxPrice],
            searchTerm: initialSearch,
        };
    });

    // State for sorting
    const [sortOptions, setSortOptions] = useState(searchParams.get('sort') || 'featured');

    // State for mobile filter sidebar visibility
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

    // Derived state for max price (calculated after products load)
    const [maxPriceFromData, setMaxPriceFromData] = useState(activeFilters.priceRange[1]); // Initial high value

    // --- Effects ---

    // Effect 1: Fetch initial products and categories data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [productsData, categoriesData] = await Promise.all([
                    ProductService.getAllProducts(),
                    CategoryService.getAllCategories() // Fetch simple category list for filters
                ]);

                const formattedProducts = productsData.map(p => ({
                    ...p,
                    price: parseFloat(p.price) || 0, // Ensure price is a number, default to 0
                    category: p.category?.id, // Extract category ID safely
                    image: p.imageUrl || `https://picsum.photos/seed/${p.id}/300/200` // Placeholder image
                }));

                setAllProducts(formattedProducts);
                // Note: setFilteredProducts is handled by the applyFiltersAndSort effect below

                const formattedCategories = categoriesData.map(c => ({ id: c.id, name: c.name }));
                setCategories(formattedCategories);

                // Determine actual max price from loaded products for the slider
                if (formattedProducts.length > 0) {
                    const calculatedMax = Math.ceil(Math.max(...formattedProducts.map(p => p.price), 0));
                    const actualMaxPrice = calculatedMax > 0 ? calculatedMax : 500; // Use 500 if max is 0
                    setMaxPriceFromData(actualMaxPrice);

                    // If max price from URL was the default high value, adjust it now
                    setActiveFilters(prev => {
                        if (prev.priceRange[1] === 9999) {
                            return { ...prev, priceRange: [prev.priceRange[0], actualMaxPrice] };
                        }
                        return prev;
                    });
                } else {
                     setMaxPriceFromData(500); // Default if no products
                }

            } catch (err) {
                console.error("Failed to fetch products page data:", err);
                setError("Could not load products. Please try again later.");
            } finally {
                setIsLoading(false); // Set loading false after all data processing
            }
        };
        fetchData();
        // This effect runs only once on mount
    }, []); // Empty dependency array

    // Effect 2: Apply filters and sorting whenever dependencies change
    // useCallback helps prevent unnecessary re-creation of the function
    const applyFiltersAndSort = useCallback(() => {
        // Guard: Don't filter until initial products are loaded
        if (isLoading || allProducts.length === 0) {
            // If still loading, maybe show empty array or keep previous state?
            // Set to empty array during loading to prevent showing stale data before skeletons appear
             // setFilteredProducts(isLoading ? [] : allProducts);
             // return;
             // Or, let the ProductGrid handle the isLoading prop directly
        }

        let tempProducts = [...allProducts];

        // Apply Search Term Filter
        if (activeFilters.searchTerm) {
            tempProducts = tempProducts.filter(p =>
                p.name && p.name.toLowerCase().includes(activeFilters.searchTerm.toLowerCase())
            );
        }

        // Apply Category Filter
        if (activeFilters.category !== 'all') {
            tempProducts = tempProducts.filter(p =>
                p.categoryDto.id === parseInt(activeFilters.category, 10) // Ensure comparison with number
            );
        }

        // Apply Price Range Filter
        tempProducts = tempProducts.filter(p =>
            p.price >= activeFilters.priceRange[0] && p.price <= activeFilters.priceRange[1]
        );

        // Apply Sorting
        switch (sortOptions) {
            case 'price-asc':
                tempProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                tempProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                tempProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            case 'name-desc':
                tempProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
                break;
            case 'featured': // Add logic if you have a featured flag or sort by creation date
            default:
                 // Default sort (e.g., by ID)
                 tempProducts.sort((a, b) => a.id - b.id);
                break;
        }

        setFilteredProducts(tempProducts);

    }, [allProducts, activeFilters, sortOptions, isLoading]); // Include isLoading here

    // Effect 3: Run the filtering/sorting function whenever its dependencies change
    useEffect(() => {
        // Apply filters after the initial data load and whenever filters/sorting/products change
         if(!isLoading) { // Only run after initial load is complete
             applyFiltersAndSort();
         }
    }, [applyFiltersAndSort, isLoading]); // Depend on the memoized function and loading state


    // Effect 4: Synchronize activeFilters state FROM URL changes (e.g., browser back/forward)
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category') || 'all';
        const searchFromUrl = searchParams.get('search') || '';
        const sortFromUrl = searchParams.get('sort') || 'featured';
        const minPriceFromUrl = parseInt(searchParams.get('minPrice') || '0', 10);
         // Use maxPriceFromData if available, otherwise keep URL or default high
        const maxPriceFromUrl = parseInt(searchParams.get('maxPrice') || maxPriceFromData.toString(), 10);

        // Update state only if it differs from URL to prevent infinite loops
        setActiveFilters(prev => {
             const needsUpdate =
                prev.category !== categoryFromUrl ||
                prev.searchTerm !== searchFromUrl ||
                prev.priceRange[0] !== minPriceFromUrl ||
                prev.priceRange[1] !== maxPriceFromUrl;

             if (needsUpdate) {
                return {
                    category: categoryFromUrl,
                    searchTerm: searchFromUrl,
                    priceRange: [minPriceFromUrl, maxPriceFromUrl],
                };
             }
             return prev; // No change needed
        });

        if (sortOptions !== sortFromUrl) {
            setSortOptions(sortFromUrl);
        }

        // Note: This effect depends on searchParams and maxPriceFromData
        // It runs when the URL changes OR when maxPriceFromData is calculated
    }, [searchParams, maxPriceFromData, sortOptions]); // Add maxPriceFromData dependency


    // --- Event Handlers ---

    // Handles changes from the ProductFilters component (search, category, price)
    const handleFilterChange = (newFilters) => {
        // newFilters is an object like { category: '3' } or { priceRange: [10, 50] } or { searchTerm: 'book' }
        const currentParams = Object.fromEntries(searchParams.entries());
        const updatedParams = { ...currentParams };

        // Update specific filters
        if (newFilters.category !== undefined) {
            if (newFilters.category === 'all') {
                 delete updatedParams.category; // Remove if 'all'
            } else {
                updatedParams.category = newFilters.category;
            }
        }
        if (newFilters.searchTerm !== undefined) {
             if (!newFilters.searchTerm) {
                 delete updatedParams.search; // Remove if empty
             } else {
                 updatedParams.search = newFilters.searchTerm;
             }
        }
        if (newFilters.priceRange !== undefined) {
            // Only set price params if they differ from the absolute min/max
            if (newFilters.priceRange[0] > 0) {
                updatedParams.minPrice = newFilters.priceRange[0].toString();
            } else {
                delete updatedParams.minPrice;
            }
            if (newFilters.priceRange[1] < maxPriceFromData) {
                 updatedParams.maxPrice = newFilters.priceRange[1].toString();
            } else {
                delete updatedParams.maxPrice;
            }
        }

        // Update URL search parameters. This will trigger the useEffect listening to searchParams
        setSearchParams(updatedParams, { replace: true }); // Use replace to avoid bloating browser history
    };

    // Handles changes from the ProductSort component
    const handleSortChange = (newSortOption) => {
         const currentParams = Object.fromEntries(searchParams.entries());
         const updatedParams = { ...currentParams };

         if (newSortOption === 'featured') {
            delete updatedParams.sort; // Remove sort param for default/featured
         } else {
            updatedParams.sort = newSortOption;
         }
        setSearchParams(updatedParams, { replace: true });
        // State update (setSortOption) happens via the useEffect listening to searchParams
    };

    // Toggles the mobile filter sidebar
    const toggleFilterSidebar = () => {
        setIsFilterSidebarOpen(!isFilterSidebarOpen);
    };

    // --- Render ---
    return (
        <div className="page-container products-page">
            <Navbar />
            <main className="products-content-area">
                <div className="products-header">
                    <h1>Explore Our Products</h1>
                    <p>Find the perfect specialty item for you.</p>
                </div>

                {/* Button to toggle filters on mobile */}
                <div className="mobile-filter-toggle">
                    <button onClick={toggleFilterSidebar}>
                        <FaFilter /> Filters & Sort
                    </button>
                </div>

                <div className="products-layout">
                    {/* Filters Sidebar */}
                    <aside className={`products-filters-sidebar ${isFilterSidebarOpen ? 'open' : ''}`}>
                        <button className="close-filters-btn" onClick={toggleFilterSidebar}>×</button>
                        {/* Pass categories, current filters, handler, and calculated max price */}
                        <ProductFilters
                            categories={categories}
                            activeFilters={activeFilters}
                            onFilterChange={handleFilterChange}
                            maxPrice={maxPriceFromData} // Pass the calculated max price
                            isLoading={isLoading} // Pass loading state if filters need it
                        />
                    </aside>

                    {/* Main Product Listing */}
                    <section className="products-listing">
                        <div className="listing-controls">
                            {/* Display count - show filtered count only when not loading */}
                            <span className="product-count">
                                { !isLoading
                                  ? `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
                                  : `Loading products...`
                                }
                                {/* Optional: show total count: ` of ${allProducts.length}` */}
                            </span>
                             {/* Sorting dropdown */}
                            <ProductSort
                                sortOption={sortOptions}
                                onSortChange={handleSortChange}
                            />
                        </div>

                        {/* Product Grid - handles its own display based on props */}
                        <ProductGrid
                            products={filteredProducts}
                            isLoading={isLoading}
                            error={error}
                        />

                        {/* Potential Future: Add Pagination Component Here */}

                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductsPage;