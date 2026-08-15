package com.sumeetsingh.resolveai.admin.service;

import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.sumeetsingh.resolveai.user.entity.Role;
import com.sumeetsingh.resolveai.user.entity.User;
import com.sumeetsingh.resolveai.user.repository.RoleRepository;
import com.sumeetsingh.resolveai.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdminDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        Role adminRole =
                roleRepository.findByRoleName("ADMIN")
                        .orElseGet(() -> {

                            Role role = new Role();

                            role.setRoleName("ADMIN");
                            role.setDescription(
                                    "System administrator"
                            );

                            return roleRepository.save(role);
                        });

        if (userRepository
                .findByUsername("admin")
                .isPresent()) {

            return;
        }

        User admin = new User();

        admin.setUsername("admin");
        admin.setEmail("admin@resolveai.local");
        admin.setPasswordHash(
                passwordEncoder.encode(
                        "Admin@12345"
                )
        );

        admin.setFirstName("System");
        admin.setLastName("Administrator");
        admin.setMobile("9999999999");
        admin.setAddress("ResolveAI");
        admin.setStatus("ACTIVE");

        admin.setRoles(
                Set.of(adminRole)
        );

        userRepository.save(admin);

        System.out.println(
                "========================================"
        );
        System.out.println(
                "ResolveAI ADMIN account created"
        );
        System.out.println(
                "Username: admin"
        );
        System.out.println(
                "Password: Admin@12345"
        );
        System.out.println(
                "========================================"
        );
    }
}