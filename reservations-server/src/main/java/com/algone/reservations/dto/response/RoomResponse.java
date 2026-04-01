package com.algone.reservations.dto.response;

import com.algone.reservations.entity.Amenity;
import com.algone.reservations.entity.Room;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
public class RoomResponse {
    private final Long id;
    private final String roomNumber;
    private final short capacity;
    private final BigDecimal pricePerNight;
    private final String description;
    private final Long roomTypeId;
    private final String roomTypeName;
    private final List<AmenityResponse> amenities;


    private RoomResponse(Long id, String roomNumber, short capacity, BigDecimal pricePerNight,
                        String description, Long roomTypeId, String roomTypeName,
                        List<AmenityResponse> amenities) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.capacity = capacity;
        this.pricePerNight = pricePerNight;
        this.description = description;
        this.roomTypeId = roomTypeId;
        this.roomTypeName = roomTypeName;
        this.amenities = amenities;
    }

    public static RoomResponse fromEntity(Room room, List<Amenity> amenities) {
        return new RoomResponse(
                room.getId(),
                room.getRoomNumber(),
                room.getCapacity(),
                room.getPricePerNight(),
                room.getDescription(),
                room.getRoomType().getId(),
                room.getRoomType().getName(),
                amenities.stream().map(AmenityResponse::fromEntity).toList()
        );
    }
}
