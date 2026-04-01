package com.algone.reservations.controller;

import com.algone.reservations.dto.response.RoomResponse;
import com.algone.reservations.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @GetMapping("/rooms")
    public ResponseEntity<Map<String, Object>> getRooms(
            @RequestParam Long hotelId,
            @RequestParam(required = false, defaultValue = "0") int capacity,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false, defaultValue = "0") Long roomTypeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(required = false) List<String> amenities
            ) {
        List<RoomResponse> rooms = roomService.getRoomsFiltered(
                hotelId, capacity, minPrice, maxPrice, roomTypeId, checkIn, checkOut, amenities
        );
        return ResponseEntity.ok(Map.of("rooms", rooms));
    }
}
