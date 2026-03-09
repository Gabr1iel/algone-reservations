package com.algone.reservations.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservation_guests")
@Getter
@Setter
@NoArgsConstructor
public class ReservationGuest {

    @EmbeddedId
    private ReservationGuestId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("reservationId")
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("guestId")
    @JoinColumn(name = "guest_id", nullable = false)
    private Guest guest;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}