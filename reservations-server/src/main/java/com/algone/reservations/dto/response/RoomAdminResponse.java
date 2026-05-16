package com.algone.reservations.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.algone.reservations.entity.Amenity;
import com.algone.reservations.entity.Room;
import lombok.AccessLevel;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
public class RoomAdminResponse {
    private final Long id;
    private final Long hotelId;
    private final String hotelName;
    private final Long roomTypeId;
    private final String roomTypeName;
    private final String roomNumber;
    private final short capacity;
    private final BigDecimal pricePerNight;
    private final String description;
    @Getter(AccessLevel.NONE)
    private final boolean isActive;
    private final LocalDateTime createdAt;
    private final List<AmenityResponse> amenities;

    private RoomAdminResponse(
            Long id,
            Long hotelId,
            String hotelName,
            Long roomTypeId,
            String roomTypeName,
            String roomNumber,
            short capacity,
            BigDecimal pricePerNight,
            String description,
            boolean isActive,
            LocalDateTime createdAt,
            List<AmenityResponse> amenities
    ) {
        this.id = id;
        this.hotelId = hotelId;
        this.hotelName = hotelName;
        this.roomTypeId = roomTypeId;
        this.roomTypeName = roomTypeName;
        this.roomNumber = roomNumber;
        this.capacity = capacity;
        this.pricePerNight = pricePerNight;
        this.description = description;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.amenities = amenities;
    }

    public static RoomAdminResponse fromEntity(Room room, List<Amenity> amenities) {
        return new RoomAdminResponse(
                room.getId(),
                room.getHotel().getId(),
                room.getHotel().getName(),
                room.getRoomType().getId(),
                room.getRoomType().getName(),
                room.getRoomNumber(),
                room.getCapacity(),
                room.getPricePerNight(),
                room.getDescription(),
                room.isActive(),
                room.getCreatedAt(),
                amenities.stream().map(AmenityResponse::fromEntity).toList()
        );
    }

    @JsonProperty("isActive")
    public boolean isActive() {
        return isActive;
    }
}
