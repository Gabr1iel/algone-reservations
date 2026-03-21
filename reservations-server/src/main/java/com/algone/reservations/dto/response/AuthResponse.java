package com.algone.reservations.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private Long userId;
    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}
