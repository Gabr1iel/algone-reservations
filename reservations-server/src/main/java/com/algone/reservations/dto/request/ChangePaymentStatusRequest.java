package com.algone.reservations.dto.request;

import com.algone.reservations.entity.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePaymentStatusRequest {

    @NotNull(message = "Stav platby je povinný.")
    private PaymentStatus status;
}
