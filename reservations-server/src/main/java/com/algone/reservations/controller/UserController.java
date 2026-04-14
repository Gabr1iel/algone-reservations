package com.algone.reservations.controller;

import com.algone.reservations.dto.response.UserResponse;
import com.algone.reservations.entity.User;
import com.algone.reservations.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "user", UserResponse.fromEntity(user)
        ));
    }
}