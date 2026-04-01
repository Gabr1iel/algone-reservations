package com.algone.reservations.dto.response;

import com.algone.reservations.entity.Amenity;
import lombok.Getter;

@Getter
public class AmenityResponse {
    private final Long id;
    private final String code;
    private final String name;

    private AmenityResponse(Long id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
    }

    public static AmenityResponse fromEntity(Amenity amenity) {
        return new AmenityResponse(amenity.getId(), amenity.getCode(), amenity.getName());
    }
}
