package com.asp.specialty.productorderservice.service;

import com.asp.specialty.productorderservice.model.Category;
import com.asp.specialty.productorderservice.model.Product;
import com.asp.specialty.productorderservice.repository.CategoryRepository;
import com.asp.specialty.productorderservice.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
    }

    public List<Product> findByCategory(Long categoryId) {
        // Verify category exists
        categoryRepository.findById(categoryId).orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId));

        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> search(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public List<Product> findByPriceRange(double minPrice, double maxPrice) {
        return productRepository.findByPriceRange(minPrice, maxPrice);
    }

    public List<Product> findLowStockProducts(int threshold) {
        return productRepository.findLowStockProducts(threshold);
    }

    @Transactional
    public Product save(Product product) {
        // Validate category
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getId()).orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + product.getCategory().getId()));
            product.setCategory(category);
        }

        return productRepository.save(product);
    }

    @Transactional
    public Product update(Long id, Product productDetails) {
        Product product = findById(id);

        // Update fields
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setImageUrl(productDetails.getImageUrl());

        // Update category if provided
        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            Category category = categoryRepository.findById(productDetails.getCategory().getId()).orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + productDetails.getCategory().getId()));
            product.setCategory(category);
        }

        return productRepository.save(product);
    }

    @Transactional
    public void delete(Long id) {
        Product product = findById(id);
        productRepository.delete(product);
    }

    @Transactional
    public void updateStock(Long productId, int quantity) {
        Product product = findById(productId);
        int newStock = product.getStockQuantity() - quantity;

        if (newStock < 0) {
            throw new IllegalStateException("Not enough stock for product: " + product.getName());
        }

        product.setStockQuantity(newStock);
        productRepository.save(product);
    }

    public boolean isInStock(Long productId, int requestedQuantity) {
        Product product = findById(productId);
        return product.getStockQuantity() >= requestedQuantity;
    }
}