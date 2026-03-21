package com.algone.reservations.service;

import com.algone.reservations.dto.request.LoginRequest;
import com.algone.reservations.dto.request.RegisterRequest;
import com.algone.reservations.dto.response.AuthResponse;
import com.algone.reservations.entity.User;
import com.algone.reservations.entity.UserRole;
import com.algone.reservations.exception.auth.EmailAlreadyExistsException;
import com.algone.reservations.repository.UserRepository;
import com.algone.reservations.security.CustomUserDetails;
import com.algone.reservations.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Uživatel s tímto emailem už existuje!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setRole(UserRole.USER);

        userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtProvider.generateToken(userDetails);

        return new AuthResponse(user.getId(), token, user.getEmail(),
                user.getFirstName(), user.getLastName(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()));
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtProvider.generateToken(userDetails);

        return new AuthResponse(userDetails.getId(), token, userDetails.getEmail(),
                userDetails.getFirstName(), userDetails.getLastName(),
                userDetails.getAuthorities().iterator().next().getAuthority()
                        .replace("ROLE_", ""));
    }
}
