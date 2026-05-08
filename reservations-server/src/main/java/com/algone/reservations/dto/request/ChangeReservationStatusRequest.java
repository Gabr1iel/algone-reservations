package com.algone.reservations.dto.request;

import com.algone.reservations.entity.ReservationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeReservationStatusRequest {

    @NotNull(message = "Stav rezervace je povinný.")
    private ReservationStatus status;
}
