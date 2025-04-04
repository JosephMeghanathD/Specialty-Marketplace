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
import java.util.List; // Import List

// Removed unused import: import static java.lang.System.exit;

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
        System.out.println("--- Starting Test Data Generation ---");

        // Clear existing data first to avoid constraint violations
        System.out.println("Clearing existing order data...");
        orderRepository.deleteAll(); // Use batch for potentially better performance
        orderRepository.flush(); // Ensure deletes are executed

        System.out.println("Clearing existing product data...");
        productRepository.deleteAllInBatch();
        productRepository.flush();

        System.out.println("Clearing existing category data...");
        categoryRepository.deleteAllInBatch();
        categoryRepository.flush();

        // Generate test data
        System.out.println("Generating predefined categories...");
        generateCategories();
        categoryRepository.flush(); // Flush after category generation

        System.out.println("Generating products...");
        generateProducts();
        productRepository.flush(); // Flush after product generation

        System.out.println("Generating orders...");
        generateOrders();
        orderRepository.flush(); // Flush after order generation

        System.out.println("--- Test Data Generation Complete ---");
    }

    private void generateCategories() {
        Faker faker = new Faker(); // Keep Faker for descriptions

        // Define the specific list of category names
        List<String> predefinedCategoryNames = List.of(
                "Food & Beverages",
                "Accessories",
                "Home & Decor",
                "Health & Wellness",
                "Art & Crafts",
                "Tech Gadgets"
        );

        System.out.println("Creating categories: " + predefinedCategoryNames);

        // Create and save categories from the predefined list
        for (String categoryName : predefinedCategoryNames) {
            Category category = new Category();
            category.setName(categoryName);
            // Still use Faker for descriptions to add some variety
            category.setDescription(faker.lorem().sentence(3)); // Use a shorter sentence
            try {
                categoryRepository.save(category);
            } catch (Exception e) {
                // Catch potential issues like unique constraint violation if run multiple times without clearing
                System.err.println("Error saving category '" + categoryName + "': " + e.getMessage());
            }
        }
        System.out.println("Finished generating " + predefinedCategoryNames.size() + " categories.");
    }

    private void generateProducts() {
        Faker faker = new Faker();
        List<Category> categories = categoryRepository.findAll(); // Get the newly created categories

        if (categories.isEmpty()) {
            System.err.println("Cannot generate products because no categories were found/created.");
            return; // Stop if categories failed to generate
        }

        int numberOfProducts = 400; // Increased number of products for better distribution
        System.out.println("Generating " + numberOfProducts + " products...");

        // Create and save products, assigning them to one of the predefined categories
        for (int i = 0; i < numberOfProducts; i++) {
            Product product = new Product();
            product.setName(faker.commerce().productName());
            product.setDescription(faker.lorem().paragraph(2)); // Slightly shorter paragraph
            // Generate slightly more realistic prices
            product.setPrice(BigDecimal.valueOf(faker.number().randomDouble(2, 5, 300)));
            product.setStockQuantity(faker.number().numberBetween(0, 150)); // Allow some out-of-stock items

            // Randomly assign one of the existing categories
            Category category = categories.get(faker.number().numberBetween(0, categories.size())); // Corrected range
            product.setCategory(category);

            // Generate image URL based on category and product name
            product.setImageUrl(getImage(category.getId(), product.getName()));

            productRepository.save(product);
        }
        System.out.println("Finished generating products.");
    }

    // Keep the same consistent image generation logic
    private static String getImage(Long categoryId, String productName) {
        // Use hashCode for pseudo-randomness based on input, ensure positive
        int nameHash = Math.abs(productName.hashCode()) % 1000;
        // Combine with categoryId for more variety, ensure positive ID mapping
        int imageId = Math.abs(categoryId.intValue() * 100) + (nameHash % 100);
        // Use Picsum photos with the generated seed
        return "https://picsum.photos/seed/" + imageId + "/500/500";
    }

    private void generateOrders() {
        Faker faker = new Faker();
        List<Product> products = productRepository.findAll();

        if (products.isEmpty()) {
            System.err.println("Cannot generate orders because no products were found/created.");
            return; // Stop if products failed
        }

        int numberOfOrders = 150; // Generate a few more orders
        System.out.println("Generating " + numberOfOrders + " orders...");

        // Create and save orders
        for (int i = 0; i < numberOfOrders; i++) {
            Order order = new Order();
            // Assuming user IDs exist in the user service DB (use a reasonable range)
            order.setUserId((long) faker.number().numberBetween(1, 10)); // Adjust range if needed
            order.setShippingAddress(faker.address().fullAddress());
            // Use a list of possible payment methods
            order.setPaymentMethod(faker.options().option("Credit Card", "PayPal", "Stripe"));
            // Generate tracking only if status will be SHIPPED later (or randomly)
            if (faker.bool().bool()) {
                order.setTrackingNumber(faker.regexify("[A-Z0-9]{10,15}")); // More realistic tracking
            }
            // Randomly set delivery date or leave null
            if (faker.bool().bool()) {
                order.setDeliveryDate(LocalDateTime.now().plusDays(faker.number().numberBetween(1, 14)));
            }

            // Add items to order
            int itemCount = faker.number().numberBetween(1, 10); // Slightly fewer items per order
            List<OrderItem> orderItems = new ArrayList<>();
            BigDecimal calculatedTotal = BigDecimal.ZERO;

            for (int j = 0; j < itemCount; j++) {
                // Ensure we don't pick the same product multiple times in one order (optional)
                Product product = products.get(faker.number().numberBetween(0, products.size())); // Corrected range

                // Check if product has stock before adding (optional but good practice)
                if (product.getStockQuantity() <= 0) {
                    //System.out.println("Skipping product " + product.getId() + " (out of stock) for order generation.");
                    continue; // Skip this item if out of stock
                }

                OrderItem orderItem = new OrderItem();
                orderItem.setProductId(product.getId());
                orderItem.setProductName(product.getName());
                orderItem.setPrice(product.getPrice());
                // Ensure quantity doesn't exceed stock
                int quantity = faker.number().numberBetween(1, Math.min(5, product.getStockQuantity()));
                orderItem.setQuantity(quantity);
                orderItem.setProductImageUrl(product.getImageUrl());

                // Add item and update calculated total
                orderItems.add(orderItem);
                orderItem.setOrder(order); // Set the back-reference
                calculatedTotal = calculatedTotal.add(product.getPrice().multiply(BigDecimal.valueOf(quantity)));

                // Simulate stock deduction (optional here, main logic is in OrderService)
                // product.setStockQuantity(product.getStockQuantity() - quantity);
                // productRepository.save(product); // Saving here might be slow, rely on OrderService logic
            }

            // If no valid items could be added (e.g., all picked products were OOS), skip order
            if (orderItems.isEmpty()) {
                System.out.println("Skipping order generation as no valid items could be added.");
                continue;
            }

            // Add all valid items to the order and set total
            order.setItems(orderItems);
            // order.calculateTotal(); // Let @PrePersist or service handle this
            order.setTotalAmount(calculatedTotal); // Set pre-calculated total

            orderRepository.save(order);
            order.setStatus(faker.options().option(Order.OrderStatus.class));
            orderRepository.save(order);
        }
        System.out.println("Finished generating orders.");
    }
}