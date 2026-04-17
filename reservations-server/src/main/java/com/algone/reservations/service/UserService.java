package com.algone.reservations.service;

import com.algone.reservations.dto.request.UpdateEmailRequest;
import com.algone.reservations.dto.request.UpdatePasswordRequest;
import com.algone.reservations.dto.request.UpdateProfileRequest;
import com.algone.reservations.entity.User;
import com.algone.reservations.exception.BusinessException;
import com.algone.reservations.exception.auth.EmailAlreadyExistsException;
import com.algone.reservations.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new BusinessException("Přihlášený uživatel nenalezen.");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Uživatel nebyl nalezen: " + email));
    }

    public User updateProfile(Authentication authentication, UpdateProfileRequest request) {
        User user = getCurrentUser(authentication);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        return userRepository.save(user);
    }

    public User updateEmail(Authentication authentication, UpdateEmailRequest request) {
        User user = getCurrentUser(authentication);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessException("Současné heslo není správné.");
        }

        if (!user.getEmail().equalsIgnoreCase(request.getNewEmail())
                && userRepository.existsByEmail(request.getNewEmail())) {
            throw new EmailAlreadyExistsException("Uživatel s tímto emailem už existuje!");
        }

        user.setEmail(request.getNewEmail());
        return userRepository.save(user);
    }

    public User updatePassword(Authentication authentication, UpdatePasswordRequest request) {
        User user = getCurrentUser(authentication);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessException("Současné heslo není správné.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        return userRepository.save(user);
    }
}
