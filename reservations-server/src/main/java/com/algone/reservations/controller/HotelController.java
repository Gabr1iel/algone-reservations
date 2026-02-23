package com.algone.reservations.controller;

import com.algone.reservations.dto.response.HotelResponse;
import com.algone.reservations.service.HotelService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController /** Označuje třídu jako orchestrátora CRUD operací, takže když přijde HTTP request typu GET, SET, PUT, DELETE tak tady se vytváří API endpointy  */
@RequestMapping("/api") /** Společná část URL */
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping("/hotels")
    public Map<String, Object> getAllHotels() {
        List<HotelResponse> hotels = hotelService.getAllHotels()
                .stream()
                .map(HotelResponse::fromEntity)
                .toList();

        return Map.of("status", "SUCCESS", "hotels", hotels);
    }
}
