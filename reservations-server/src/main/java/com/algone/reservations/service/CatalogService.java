package com.algone.reservations.service;

import com.algone.reservations.entity.Amenity;
import com.algone.reservations.entity.RoomType;
import com.algone.reservations.repository.AmenityRepository;
import com.algone.reservations.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final RoomTypeRepository roomTypeRepository;
    private final AmenityRepository amenityRepository;

    @Transactional(readOnly = true)
    public List<RoomType> getRoomTypes(Long hotelId) {
        return roomTypeRepository.findByHotelId(hotelId);
    }

    @Transactional(readOnly = true)
    public List<Amenity> getAmenities() {
        return amenityRepository.findAllOrderedByName();
    }
}
