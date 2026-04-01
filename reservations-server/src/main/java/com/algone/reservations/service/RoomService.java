package com.algone.reservations.service;

import com.algone.reservations.dto.response.RoomResponse;
import com.algone.reservations.entity.Amenity;
import com.algone.reservations.entity.ReservationStatus;
import com.algone.reservations.entity.Room;
import com.algone.reservations.entity.RoomAmenity;
import com.algone.reservations.repository.ReservationRepository;
import com.algone.reservations.repository.RoomAmenityRepository;
import com.algone.reservations.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final RoomAmenityRepository roomAmenityRepository;
    private final ReservationRepository reservationRepository;

    public List<RoomResponse> getRoomsFiltered(
            long hotelId,
            int minCapacity,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            long roomTypeId,
            LocalDate checkIn,
            LocalDate checkOut,
            List<String> amenityCodes
    ) {
        List<Room> rooms = roomRepository.findRoomsFiltered(hotelId, minCapacity, minPrice, maxPrice, roomTypeId);

        if  (rooms.isEmpty()) return List.of();

        // Filtr dostupnosti -> vyloučí se pokoje s překrývající rezervací
        if (checkIn != null && checkOut != null) {
            List<Long> roomIds = rooms.stream().map(Room::getId).toList();
            List<Long> bookedIds = reservationRepository.findBookedRoomIds(
                    roomIds, checkIn, checkOut, ReservationStatus.CANCELLED
            );
            rooms = rooms.stream().filter(r -> !bookedIds.contains(r.getId())).toList();
        }

        if   (rooms.isEmpty()) return List.of();

        // Batch load amenities pro všechny pokoje najednou (bez N+1 problému)
        List<Long> finalRoomIds = rooms.stream().map(Room::getId).toList();
        List<RoomAmenity> allRoomAmenities = roomAmenityRepository.findByRoomIds(finalRoomIds);

        Map<Long, List<Amenity>> amenitiesByRoom = allRoomAmenities.stream()
                .collect(Collectors.groupingBy(
                        ra -> ra.getRoom().getId(),
                        Collectors.mapping(RoomAmenity::getAmenity, Collectors.toList())
                ));

        // Filtr vybavení - pokoj musí mít VŠECHNA zadaná vybavení
        return rooms.stream()
                .filter(room -> {
                    if (amenityCodes == null || amenityCodes.isEmpty()) return true;
                    List<String> roomCodes = amenitiesByRoom
                            .getOrDefault(room.getId(), List.of())
                            .stream().map(Amenity::getCode).toList();
                    return roomCodes.containsAll(amenityCodes);
                })
                .map(room -> RoomResponse.fromEntity(
                        room,
                        amenitiesByRoom.getOrDefault(room.getId(), List.of())
                ))
                .toList();
    }
}
