package com.asp.specialty.productorderservice.service;

import com.asp.specialty.productorderservice.model.Category;
import com.asp.specialty.productorderservice.model.Order;
import com.asp.specialty.productorderservice.repository.CategoryRepository;
import com.asp.specialty.productorderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    public Category update(Long id, Category category) {
        return categoryRepository.save(category);    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }
}
