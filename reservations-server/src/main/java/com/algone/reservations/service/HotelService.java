package com.algone.reservations.service;

import com.algone.reservations.entity.Hotel;
import com.algone.reservations.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAllHotels();
    }

    public Optional<Hotel> findHotelById(long id) {return hotelRepository.findHotelById(id);}
}
