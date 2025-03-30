package  com.asp.specialty.productorderservice.service;

import com.asp.specialty.productorderservice.model.Order;
import com.asp.specialty.productorderservice.model.OrderItem;
import com.asp.specialty.productorderservice.model.Product;
import com.asp.specialty.productorderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductService productService;

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Order findById(Long id) {
        return orderRepository.findOrderWithItems(id);
    }

    public List<Order> findByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> findByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    public List<Order> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findOrdersByDateRange(startDate, endDate);
    }

    @Transactional
    public Order createOrder(Order order) {
        // Validate items and update stock
        for (OrderItem item : order.getItems()) {
            Product product = productService.findById(item.getProductId());

            // Check stock
            if (!productService.isInStock(product.getId(), item.getQuantity())) {
                throw new IllegalStateException("Not enough stock for product: " + product.getName());
            }

            // Set product details in order item
            item.setProductName(product.getName());
            item.setPrice(product.getPrice());
            item.setProductImageUrl(product.getImageUrl());
            item.setOrder(order);

            // Update product stock
            productService.updateStock(product.getId(), item.getQuantity());
        }

        // Calculate total amount
        order.calculateTotal();

        // Save order
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = findById(id);
        order.setStatus(status);

        // Add delivery date if status is DELIVERED
        if (status == Order.OrderStatus.DELIVERED) {
            order.setDeliveryDate(LocalDateTime.now());
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateTrackingInfo(Long id, String trackingNumber) {
        Order order = findById(id);
        order.setTrackingNumber(trackingNumber);

        // Set status to shipped if tracking number is provided
        if (trackingNumber != null && !trackingNumber.isEmpty()) {
            order.setStatus(Order.OrderStatus.SHIPPED);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public void cancelOrder(Long id) {
        Order order = findById(id);

        // Only allow cancellation for pending or processing orders
        if (order.getStatus() == Order.OrderStatus.PENDING || order.getStatus() == Order.OrderStatus.PROCESSING) {
            // Return items to inventory
            for (OrderItem item : order.getItems()) {
                Product product = productService.findById(item.getProductId());
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productService.save(product);
            }

            order.setStatus(Order.OrderStatus.CANCELLED);
            orderRepository.save(order);
        } else {
            throw new IllegalStateException("Cannot cancel order with status: " + order.getStatus());
        }
    }

    public Long countOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.countByStatus(status);
    }

    public List<Order> findRecentOrdersByUser(Long userId) {
        return orderRepository.findRecentOrdersByUser(userId);
    }
}