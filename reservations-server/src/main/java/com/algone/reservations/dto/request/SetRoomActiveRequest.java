package com.algone.reservations.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SetRoomActiveRequest {

    @NotNull(message = "Příznak aktivní je povinný.")
    private Boolean active;
}
