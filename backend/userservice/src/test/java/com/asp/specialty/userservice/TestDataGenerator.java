package com.asp.specialty.userservice;

import com.asp.specialty.userservice.model.Role;
import com.asp.specialty.userservice.model.User;
import com.asp.specialty.userservice.model.Role.ERole;
import com.asp.specialty.userservice.repository.RoleRepository;
import com.asp.specialty.userservice.repository.UserRepository;
import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

import static java.lang.System.exit;

@SpringBootApplication
public class TestDataGenerator implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    public static void main(String[] args) {
        SpringApplication.run(TestDataGenerator.class, args);
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Clear existing data
        userRepository.deleteAll();
        roleRepository.deleteAll();

        // Generate test data
        generateRoles();
        generateUsers();
        userRepository.flush();
        roleRepository.flush();
    }

    private void generateRoles() {
        // Create roles
        Role userRole = new Role(ERole.ROLE_USER);
        Role adminRole = new Role(ERole.ROLE_ADMIN);
        Role moderatorRole = new Role(ERole.ROLE_MODERATOR);

        // Save roles to the database
        roleRepository.save(userRole);
        roleRepository.save(adminRole);
        roleRepository.save(moderatorRole);
    }

    private void generateUsers() {
        Faker faker = new Faker();

        saveUser("admin", "admin", "Admin", "Admin", new HashSet<>(roleRepository.findAll()));

        // Generate 10 users with random data
        for (int i = 0; i < 10; i++) {
            // Assign random roles to the user
            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName(ERole.ROLE_USER).orElseThrow());
            if (i % 3 == 0) roles.add(roleRepository.findByName(ERole.ROLE_ADMIN).orElseThrow());
            if (i % 2 == 0) roles.add(roleRepository.findByName(ERole.ROLE_MODERATOR).orElseThrow());

            String username = faker.name().username();
            String email = faker.internet().emailAddress();
            String firstName = faker.name().firstName();
            String lastName = faker.name().lastName();

            saveUser(username, email, firstName, lastName, roles);
        }
    }

    private void saveUser(String username, String email, String firstName, String lastName, Set<Role> roles) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(encoder.encode("wow"));
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRoles(roles);

        // Save user to the database
        userRepository.save(user);
    }
}
