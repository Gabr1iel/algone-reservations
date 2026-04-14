package com.algone.reservations.dto.response;

import com.algone.reservations.entity.User;
import lombok.Getter;

@Getter
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String phone;

    public static UserResponse fromEntity(User user) {
        UserResponse response = new UserResponse();
        response.id = user.getId();
        response.firstName = user.getFirstName();
        response.lastName = user.getLastName();
        response.email = user.getEmail();
        response.role = user.getRole() != null ? user.getRole().name() : null;
        response.phone = user.getPhone();
        return response;
    }
}