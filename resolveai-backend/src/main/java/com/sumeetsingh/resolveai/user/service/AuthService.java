package com.sumeetsingh.resolveai.user.service;

import com.sumeetsingh.resolveai.security.JwtService;
import com.sumeetsingh.resolveai.user.dto.LoginRequest;
import com.sumeetsingh.resolveai.user.dto.LoginResponse;
import com.sumeetsingh.resolveai.user.dto.RegisterRequest;
import com.sumeetsingh.resolveai.user.dto.RegisterResponse;
import com.sumeetsingh.resolveai.user.entity.Role;
import com.sumeetsingh.resolveai.user.entity.User;
import com.sumeetsingh.resolveai.user.repository.RoleRepository;
import com.sumeetsingh.resolveai.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        Role employeeRole = roleRepository.findByRoleName("EMPLOYEE")
                .orElseThrow(() ->
                        new IllegalStateException("EMPLOYEE role not found")
                );

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setMobile(request.getMobile());
        user.setAddress(request.getAddress());

        user.getRoles().add(employeeRole);

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getUserId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getStatus()
        );
    }
    public LoginResponse login(LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()
                        )
                );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found")
                );

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails);

        Set<String> roles = user.getRoles()
                .stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet());

        return new LoginResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                roles,
                token
        );
    }
}