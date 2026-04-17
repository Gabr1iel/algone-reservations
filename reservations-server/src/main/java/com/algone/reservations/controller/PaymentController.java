package com.algone.reservations.controller;

import com.algone.reservations.dto.request.CreatePaymentRequest;
import com.algone.reservations.dto.response.PaymentResponse;
import com.algone.reservations.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/reservations/{id}/payments")
    public ResponseEntity<Map<String, Object>> getPaymentsForReservation(
            Authentication authentication,
            @PathVariable Long id
    ) {
        List<PaymentResponse> payments = paymentService.getPaymentsForReservation(authentication, id)
                .stream()
                .map(PaymentResponse::fromEntity)
                .toList();

        return ResponseEntity.ok(Map.of("payments", payments));
    }

    @PostMapping("/reservations/{id}/payments")
    public ResponseEntity<PaymentResponse> createPayment(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody CreatePaymentRequest request
    ) {
        PaymentResponse payment = PaymentResponse.fromEntity(
                paymentService.createPayment(authentication, id, request)
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }
}