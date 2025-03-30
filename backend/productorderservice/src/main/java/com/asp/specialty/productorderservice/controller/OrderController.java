package com.asp.specialty.productorderservice.controller;

import com.asp.specialty.productorderservice.model.Order;
import com.asp.specialty.productorderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.findById(id);

        // Check if user is authorized to view this order
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !auth.getName().equals(order.getUserId().toString())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(order);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Order>> getCurrentUserOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(auth.getName());
        return ResponseEntity.ok(orderService.findByUserId(userId));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.name")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.findByUserId(userId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.findByStatus(status));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(orderService.findByDateRange(startDate, endDate));
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        // Set user ID from authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        order.setUserId(Long.parseLong(auth.getName()));

        try {
            Order createdOrder = orderService.createOrder(order);
            return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            Order.OrderStatus status = Order.OrderStatus.valueOf(statusUpdate.get("status"));
            return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}/tracking")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateTrackingInfo(
            @PathVariable Long id,
            @RequestBody Map<String, String> trackingInfo) {
        String trackingNumber = trackingInfo.get("trackingNumber");
        return ResponseEntity.ok(orderService.updateTrackingInfo(id, trackingNumber));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        Order order = orderService.findById(id);

        // Check if user is authorized to cancel this order
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !auth.getName().equals(order.getUserId().toString())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            orderService.cancelOrder(id);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @GetMapping("/stats/status-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<Order.OrderStatus, Long>> getOrderStatusCounts() {
        Map<Order.OrderStatus, Long> statusCounts = Map.of(
                Order.OrderStatus.PENDING, orderService.countOrdersByStatus(Order.OrderStatus.PENDING),
                Order.OrderStatus.PROCESSING, orderService.countOrdersByStatus(Order.OrderStatus.PROCESSING),
                Order.OrderStatus.SHIPPED, orderService.countOrdersByStatus(Order.OrderStatus.SHIPPED),
                Order.OrderStatus.DELIVERED, orderService.countOrdersByStatus(Order.OrderStatus.DELIVERED),
                Order.OrderStatus.CANCELLED, orderService.countOrdersByStatus(Order.OrderStatus.CANCELLED)
        );

        return ResponseEntity.ok(statusCounts);
    }

    @GetMapping("/user/{userId}/recent")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.name")
    public ResponseEntity<List<Order>> getUserRecentOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.findRecentOrdersByUser(userId));
    }
}