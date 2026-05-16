package com.algone.reservations.dto.response;

import com.algone.reservations.entity.RoomType;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class RoomTypeResponse {
    private final Long id;
    private final Long hotelId;
    private final String name;
    private final String description;
    private final short maxCapacity;
    private final BigDecimal basePrice;

    private RoomTypeResponse(Long id, Long hotelId, String name, String description, short maxCapacity, BigDecimal basePrice) {
        this.id = id;
        this.hotelId = hotelId;
        this.name = name;
        this.description = description;
        this.maxCapacity = maxCapacity;
        this.basePrice = basePrice;
    }

    public static RoomTypeResponse fromEntity(RoomType roomType) {
        return new RoomTypeResponse(
                roomType.getId(),
                roomType.getHotel().getId(),
                roomType.getName(),
                roomType.getDescription(),
                roomType.getMaxCapacity(),
                roomType.getBasePrice()
        );
    }
}
