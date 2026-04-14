package com.algone.reservations.dto.response;

import com.algone.reservations.entity.Payment;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
public class PaymentResponse {

    private Long id;
    private Long reservationId;
    private BigDecimal amount;
    private String currency;
    private String method;
    private String status;
    private LocalDateTime paidAt;
    private String providerRef;
    private LocalDateTime createdAt;

    public static PaymentResponse fromEntity(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.id = payment.getId();
        response.reservationId = payment.getReservation() != null ? payment.getReservation().getId() : null;
        response.amount = payment.getAmount();
        response.currency = payment.getCurrency();
        response.method = payment.getMethod() != null ? payment.getMethod().name() : null;
        response.status = payment.getStatus() != null ? payment.getStatus().name() : null;
        response.paidAt = payment.getPaidAt();
        response.providerRef = payment.getProviderRef();
        response.createdAt = payment.getCreatedAt();
        return response;
    }
}