package com.algone.reservations.controller;

import com.algone.reservations.dto.request.CreateReservationRequest;
import com.algone.reservations.dto.response.ReservationResponse;
import com.algone.reservations.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping("/my")
    public ResponseEntity<Map<String, Object>> getMyReservations(Authentication authentication) {
        List<ReservationResponse> reservations =
                reservationService.getMyReservations(authentication)
                        .stream()
                        .map(ReservationResponse::fromEntity)
                        .toList();

        return ResponseEntity.ok(Map.of("reservations", reservations));
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            Authentication authentication,
            @Valid @RequestBody CreateReservationRequest request
    ) {
        ReservationResponse reservation = ReservationResponse.fromEntity(
                reservationService.createReservation(authentication, request)
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ReservationResponse> cancelReservation(
            Authentication authentication,
            @PathVariable Long id
    ) {
        ReservationResponse reservation = ReservationResponse.fromEntity(
                reservationService.cancelReservation(authentication, id)
        );

        return ResponseEntity.ok(reservation);
    }
}