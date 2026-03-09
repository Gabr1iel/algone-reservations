package com.algone.reservations.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ReservationGuestId implements Serializable {

    @Column(name = "reservation_id")
    private Long reservationId;

    @Column(name = "guest_id")
    private Long guestId;
}