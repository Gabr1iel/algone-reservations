package com.algone.reservations.controller;

import com.algone.reservations.dto.request.ChangeReservationStatusRequest;
import com.algone.reservations.dto.response.ReservationResponse;
import com.algone.reservations.entity.ReservationStatus;
import com.algone.reservations.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/reservations")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(required = false) ReservationStatus status
    ) {
        List<ReservationResponse> reservations = reservationService
                .getAllForAdmin(Optional.ofNullable(status))
                .stream()
                .map(ReservationResponse::fromEntity)
                .toList();

        return ResponseEntity.ok(Map.of("reservations", reservations));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ReservationResponse> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody ChangeReservationStatusRequest request
    ) {
        ReservationResponse reservation = ReservationResponse.fromEntity(
                reservationService.changeStatus(id, request.getStatus())
        );
        return ResponseEntity.ok(reservation);
    }
}
