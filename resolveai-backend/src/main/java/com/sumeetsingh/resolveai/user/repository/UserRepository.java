package com.sumeetsingh.resolveai.user.repository;

import com.sumeetsingh.resolveai.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    long countByStatus(String status);

    @Query("""
            SELECT DISTINCT u
            FROM User u
            JOIN u.roles r
            WHERE r.roleName = 'EMPLOYEE'
              AND u.status = 'ACTIVE'
              AND (
                    :search IS NULL
                    OR :search = ''
                    OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            ORDER BY u.firstName ASC, u.lastName ASC, u.username ASC
            """)
    List<User> searchActiveEmployees(
            @Param("search") String search
    );
}