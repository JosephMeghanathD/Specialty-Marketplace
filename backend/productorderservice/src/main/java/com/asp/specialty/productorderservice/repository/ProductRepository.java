package com.asp.specialty.productorderservice.repository;

import com.asp.specialty.productorderservice.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByNameContainingIgnoreCase(String name);

    @Query("SELECT p FROM Product p WHERE p.stockQuantity > 0")
    List<Product> findAvailableProducts();

    @Query("SELECT p FROM Product p WHERE p.stockQuantity < :threshold")
    List<Product> findLowStockProducts(@Param("threshold") int threshold);

    @Query("SELECT p FROM Product p ORDER BY p.price ASC")
    List<Product> findAllOrderByPriceAsc();

    @Query("SELECT p FROM Product p ORDER BY p.price DESC")
    List<Product> findAllOrderByPriceDesc();

    @Query("SELECT p FROM Product p WHERE p.price >= :minPrice AND p.price <= :maxPrice")
    List<Product> findByPriceRange(@Param("minPrice") double minPrice, @Param("maxPrice") double maxPrice);

    @Query(value = """
    SELECT * FROM (
        SELECT p.*, 
               ROW_NUMBER() OVER (PARTITION BY p.category_id ORDER BY p.stock_quantity DESC) AS rank 
        FROM products p 
        WHERE p.stock_quantity > 0
    ) ranked 
    WHERE ranked.rank <= 2 LIMIT 5
""", nativeQuery = true)
    List<Product> findFeaturedProducts();

    @Query("SELECT p FROM Product p " +
            "JOIN OrderItem oi ON p.id = oi.productId " +
            "GROUP BY p.id, p.name " +
            "ORDER BY COUNT(oi.id) DESC LIMIT 5")
    List<Product> findTop10PopularProducts();

    @Query("SELECT p FROM Product p " +
            "JOIN OrderItem oi ON p.id = oi.productId " +
            "WHERE p.category.id = :categoryId " +
            "GROUP BY p.id " +
            "ORDER BY COUNT(oi) DESC LIMIT 5")
    List<Product> findTop10PopularProducts(@Param("categoryId") Long categoryId);


}
