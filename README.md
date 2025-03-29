# Specialty-Marketplace
I'll simplify the microservice architecture for your Specialty Marketplace project. Let's focus on just two core microservices with a more straightforward structure.

## Simplified Microservices Structure

### 1. User Service

Handles user authentication and profile management.

**Files Structure:**
```
user-service/
├── src/main/java/com/specialty/userservice/
│   ├── UserServiceApplication.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   └── UserController.java
│   ├── model/
│   │   ├── User.java
│   │   └── Role.java
│   ├── repository/
│   │   └── UserRepository.java
│   ├── service/
│   │   └── UserService.java
│   └── security/
│       ├── JwtUtil.java
│       └── WebSecurityConfig.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

### 2. Product-Order Service

Combines product management and order processing in one service.

**Files Structure:**
```
product-order-service/
├── src/main/java/com/specialty/productorderservice/
│   ├── ProductOrderServiceApplication.java
│   ├── controller/
│   │   ├── ProductController.java
│   │   ├── CategoryController.java
│   │   └── OrderController.java
│   ├── model/
│   │   ├── Product.java
│   │   ├── Category.java
│   │   ├── Order.java
│   │   └── OrderItem.java
│   ├── repository/
│   │   ├── ProductRepository.java
│   │   ├── CategoryRepository.java
│   │   └── OrderRepository.java
│   ├── service/
│   │   ├── ProductService.java
│   │   └── OrderService.java
│   └── security/
│       └── JwtRequestFilter.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## Basic Configuration Files

### application.properties (User Service)

```properties
# Server configuration
server.port=8081
spring.application.name=user-service

# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/specialty_users
spring.datasource.username=postgres
spring.datasource.password=password

# Hibernate properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT Configuration
jwt.secret=specialty_marketplace_secret_key
jwt.expiration=86400000
```

### application.properties (Product-Order Service)

```properties
# Server configuration
server.port=8082
spring.application.name=product-order-service

# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/specialty_products_orders
spring.datasource.username=postgres
spring.datasource.password=password

# Hibernate properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT Configuration
jwt.secret=specialty_marketplace_secret_key
```

## Basic Implementation Samples

### User Service

**User.java**
```java
package com.specialty.userservice.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String firstName;
    private String lastName;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();
    
    // Getters and setters
}
```

**UserController.java**
```java
package com.specialty.userservice.controller;

import com.specialty.userservice.model.User;
import com.specialty.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.update(id, user));
    }
    
    // Other endpoints
}
```

### Product-Order Service

**Product.java**
```java
package com.specialty.productorderservice.model;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    private int stockQuantity;
    
    private String imageUrl;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    
    // Getters and setters
}
```

**Order.java**
```java
package com.specialty.productorderservice.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    
    @Column(nullable = false)
    private LocalDateTime orderDate;
    
    private String status;
    
    private BigDecimal totalAmount;
    
    private String shippingAddress;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items = new ArrayList<>();
    
    // Getters and setters
}
```

**ProductController.java**
```java
package com.specialty.productorderservice.controller;

import com.specialty.productorderservice.model.Product;
import com.specialty.productorderservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.findByCategory(categoryId));
    }
    
    // Admin endpoints
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.save(product));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.update(id, product));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok().build();
    }
}
```

## Development Steps

1. Start by creating the Spring Boot projects for each service
2. Implement the entity classes (User, Product, Order)
3. Create JPA repositories for database operations
4. Implement basic service layer with CRUD operations
5. Add JWT authentication for secure API access
6. Develop controllers for handling HTTP requests
7. Test the APIs with Postman or similar tool

This simplified approach focuses on the core functionality while maintaining a clean separation of concerns. It's easier to set up and manage while still providing a solid foundation for your e-commerce application.

Would you like me to provide implementation details for any specific component?
