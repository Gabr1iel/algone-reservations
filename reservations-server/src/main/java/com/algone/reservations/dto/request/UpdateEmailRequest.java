package com.algone.reservations.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateEmailRequest {

    @NotBlank
    @Email
    private String newEmail;

    @NotBlank
    private String currentPassword;
}
