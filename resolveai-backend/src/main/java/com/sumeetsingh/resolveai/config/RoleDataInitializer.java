package com.sumeetsingh.resolveai.config;

import com.sumeetsingh.resolveai.user.entity.Role;
import com.sumeetsingh.resolveai.user.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleDataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleDataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {

        createRoleIfNotExists(
                "ADMIN",
                "System administrator"
        );

        createRoleIfNotExists(
                "PROJECT_MANAGER",
                "Manages projects and project members"
        );

        createRoleIfNotExists(
                "SUPPORT_AGENT",
                "Handles support requests and incidents"
        );

        createRoleIfNotExists(
                "EMPLOYEE",
                "Regular platform employee"
        );
    }

    private void createRoleIfNotExists(String roleName, String description) {

        if (roleRepository.findByRoleName(roleName).isEmpty()) {
            roleRepository.save(new Role(roleName, description));
        }
    }
}