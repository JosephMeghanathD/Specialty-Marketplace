package com.asp.specialty.productorderservice;

import com.asp.specialty.productorderservice.model.Category;
import com.asp.specialty.productorderservice.model.Order;
import com.asp.specialty.productorderservice.model.OrderItem;
import com.asp.specialty.productorderservice.model.Product;
import com.asp.specialty.productorderservice.repository.CategoryRepository;
import com.asp.specialty.productorderservice.repository.OrderRepository;
import com.asp.specialty.productorderservice.repository.ProductRepository;
import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static java.lang.System.exit;

@SpringBootApplication
public class TestDataGenerator implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    public static void main(String[] args) {
        SpringApplication.run(TestDataGenerator.class, args);
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Clear existing data
        orderRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();

        // Generate test data
        generateCategories();
        generateProducts();
        generateOrders();

        categoryRepository.flush();
        productRepository.flush();
        orderRepository.flush();

    }

    private void generateCategories() {
        Faker faker = new Faker();

        // Create and save categories
        for (int i = 0; i < 5; i++) {
            Category category = new Category();
            category.setName(faker.commerce().department());
            category.setDescription(faker.lorem().sentence());

            categoryRepository.save(category);
        }
    }

    private void generateProducts() {
        Faker faker = new Faker();
        List<Category> categories = categoryRepository.findAll();

        // Create and save products
        for (int i = 0; i < 20; i++) {
            Product product = new Product();
            product.setName(faker.commerce().productName());
            product.setDescription(faker.lorem().paragraph());
            product.setPrice(new BigDecimal(faker.commerce().price()));
            product.setStockQuantity(faker.number().numberBetween(1, 100));
            Category category = categories.get(faker.number().numberBetween(0, categories.size()));
            product.setImageUrl(getImage(category.getId(), product.getName()));
            product.setCategory(category);

            productRepository.save(product);
        }
    }

    private static String getImage(Long categoryId, String productName) {
        int nameHash = Math.abs(productName.hashCode()) % 1000;

        int imageId = (categoryId.intValue() * 100) + (nameHash % 100);

        return "https://picsum.photos/seed/" + imageId + "/500/500";
    }

    private void generateOrders() {
        Faker faker = new Faker();
        List<Product> products = productRepository.findAll();

        // Create and save orders
        for (int i = 0; i < 10; i++) {
            Order order = new Order();
            order.setUserId((long) faker.number().numberBetween(1, 10));
            order.setShippingAddress(faker.address().fullAddress());
            order.setPaymentMethod(faker.finance().creditCard());
            order.setTrackingNumber(faker.number().digits(10));
            order.setDeliveryDate(LocalDateTime.now().plusDays(faker.number().numberBetween(1, 7)));

            // Add items to order
            int itemCount = faker.number().numberBetween(1, 5);
            List<OrderItem> orderItems = new ArrayList<>();

            for (int j = 0; j < itemCount; j++) {
                OrderItem orderItem = new OrderItem();
                Product product = products.get(faker.number().numberBetween(0, products.size()));

                orderItem.setProductId(product.getId());
                orderItem.setProductName(product.getName());
                orderItem.setPrice(product.getPrice());
                orderItem.setQuantity(faker.number().numberBetween(1, 5));
                orderItem.setProductImageUrl(product.getImageUrl());
                orderItems.add(orderItem);
            }

            // Add all items to the order and calculate total
            order.setItems(orderItems);
            order.calculateTotal();

            orderRepository.save(order);
        }
    }
}
