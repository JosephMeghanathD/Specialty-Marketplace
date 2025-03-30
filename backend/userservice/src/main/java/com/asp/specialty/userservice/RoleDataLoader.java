package com.asp.specialty.userservice;

import com.asp.specialty.userservice.model.Role;
import com.asp.specialty.userservice.model.Role.ERole;
import com.asp.specialty.userservice.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleDataLoader implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if the roles already exist to avoid duplicates
        if (roleRepository.count() == 0) {
            // Create and save roles
            roleRepository.save(new Role(ERole.ROLE_USER));
            roleRepository.save(new Role(ERole.ROLE_MODERATOR));
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
            System.out.println("Roles added to the database.");
        }
    }
}
