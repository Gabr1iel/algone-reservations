package com.algone.reservations.controller;

import com.algone.reservations.dto.response.HotelResponse;
import com.algone.reservations.service.HotelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping("/hotels")
    public ResponseEntity<Map<String, Object>> getAllHotels() {
        List<HotelResponse> hotels = hotelService.getAllHotels()
                .stream()
                .map(HotelResponse::fromEntity)
                .toList();

        return ResponseEntity.ok(Map.of("hotels", hotels));
    }

    @GetMapping("/hotels/{id}")
    public ResponseEntity<?> findHotelById(@PathVariable long id) {
        return hotelService.findHotelById(id)
                .<ResponseEntity<?>>map(hotel -> ResponseEntity.ok(HotelResponse.fromEntity(hotel)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Hotel nebyl nalezen")));
    }
}
