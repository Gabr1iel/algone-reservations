package com.algone.reservations.controller;

import com.algone.reservations.dto.response.AmenityResponse;
import com.algone.reservations.dto.response.RoomTypeResponse;
import com.algone.reservations.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CatalogController {

    private final CatalogService catalogService;

    @GetMapping("/room-types")
    public ResponseEntity<Map<String, Object>> getRoomTypes(@RequestParam Long hotelId) {
        List<RoomTypeResponse> roomTypes = catalogService.getRoomTypes(hotelId)
                .stream()
                .map(RoomTypeResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(Map.of("roomTypes", roomTypes));
    }

    @GetMapping("/amenities")
    public ResponseEntity<Map<String, Object>> getAmenities() {
        List<AmenityResponse> amenities = catalogService.getAmenities()
                .stream()
                .map(AmenityResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(Map.of("amenities", amenities));
    }
}
