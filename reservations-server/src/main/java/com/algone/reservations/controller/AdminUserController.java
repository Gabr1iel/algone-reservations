package com.algone.reservations.controller;

import com.algone.reservations.dto.response.UserResponse;
import com.algone.reservations.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        List<UserResponse> users = adminUserService.getAll().stream()
                .map(UserResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(Map.of("users", users));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        adminUserService.delete(id, authentication);
        return ResponseEntity.noContent().build();
    }
}
