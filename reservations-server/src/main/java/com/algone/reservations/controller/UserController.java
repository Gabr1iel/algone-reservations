package com.algone.reservations.controller;

import com.algone.reservations.dto.request.UpdateEmailRequest;
import com.algone.reservations.dto.request.UpdatePasswordRequest;
import com.algone.reservations.dto.request.UpdateProfileRequest;
import com.algone.reservations.dto.response.UserResponse;
import com.algone.reservations.entity.User;
import com.algone.reservations.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);

        return ResponseEntity.ok(UserResponse.fromEntity(user));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        User user = userService.updateProfile(authentication, request);
        return ResponseEntity.ok(UserResponse.fromEntity(user));
    }

    @PutMapping("/me/email")
    public ResponseEntity<UserResponse> updateEmail(
            Authentication authentication,
            @Valid @RequestBody UpdateEmailRequest request
    ) {
        User user = userService.updateEmail(authentication, request);
        return ResponseEntity.ok(UserResponse.fromEntity(user));
    }

    @PutMapping("/me/password")
    public ResponseEntity<UserResponse> updatePassword(
            Authentication authentication,
            @Valid @RequestBody UpdatePasswordRequest request
    ) {
        User user = userService.updatePassword(authentication, request);
        return ResponseEntity.ok(UserResponse.fromEntity(user));
    }
}
