package com.algone.reservations.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class UpdateRoomRequest {

    @NotNull(message = "Typ pokoje je povinný.")
    private Long roomTypeId;

    @NotBlank(message = "Číslo pokoje je povinné.")
    private String roomNumber;

    @Min(value = 1, message = "Kapacita musí být alespoň 1.")
    private short capacity;

    @NotNull(message = "Cena za noc je povinná.")
    @DecimalMin(value = "0.01", message = "Cena za noc musí být kladná.")
    private BigDecimal pricePerNight;

    private String description;
    private Boolean isActive = true;
    private List<Long> amenityIds;
}
