package com.algone.reservations.dto.request;

import com.algone.reservations.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePaymentRequest {

    @NotNull
    private PaymentMethod method;
}