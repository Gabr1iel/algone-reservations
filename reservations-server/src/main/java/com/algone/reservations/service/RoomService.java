package com.algone.reservations.service;

import com.algone.reservations.dto.request.CreateRoomRequest;
import com.algone.reservations.dto.request.UpdateRoomRequest;
import com.algone.reservations.dto.response.RoomAdminResponse;
import com.algone.reservations.dto.response.RoomResponse;
import com.algone.reservations.entity.Amenity;
import com.algone.reservations.entity.Hotel;
import com.algone.reservations.entity.ReservationStatus;
import com.algone.reservations.entity.Room;
import com.algone.reservations.entity.RoomAmenity;
import com.algone.reservations.entity.RoomAmenityId;
import com.algone.reservations.entity.RoomType;
import com.algone.reservations.exception.ConflictException;
import com.algone.reservations.exception.NotFoundException;
import com.algone.reservations.repository.AmenityRepository;
import com.algone.reservations.repository.HotelRepository;
import com.algone.reservations.repository.ReservationRepository;
import com.algone.reservations.repository.RoomAmenityRepository;
import com.algone.reservations.repository.RoomRepository;
import com.algone.reservations.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final AmenityRepository amenityRepository;

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    public List<RoomAdminResponse> getAllForAdmin(Long hotelId) {
        List<Room> rooms = roomRepository.findAllForAdmin(hotelId);
        return toAdminResponses(rooms);
    }

    @Transactional(readOnly = true)
    public RoomAdminResponse getForAdmin(Long id) {
        Room room = roomRepository.findAdminRoomById(id)
                .orElseThrow(() -> new NotFoundException("Pokoj nebyl nalezen: " + id));
        List<Amenity> amenities = roomAmenityRepository.findByRoomId(room.getId())
                .stream()
                .map(RoomAmenity::getAmenity)
                .toList();
        return RoomAdminResponse.fromEntity(room, amenities);
    }

    @Transactional(rollbackFor = Exception.class)
    public RoomAdminResponse create(CreateRoomRequest request) {
        Hotel hotel = hotelRepository.findHotelById(request.getHotelId())
                .orElseThrow(() -> new NotFoundException("Hotel nebyl nalezen: " + request.getHotelId()));
        RoomType roomType = getRoomTypeForHotel(request.getRoomTypeId(), hotel.getId());

        if (roomRepository.existsByHotelIdAndRoomNumber(hotel.getId(), request.getRoomNumber())) {
            throw new ConflictException("Číslo pokoje musí být v rámci hotelu unikátní.");
        }

        Room room = new Room();
        room.setHotel(hotel);
        room.setRoomType(roomType);
        room.setRoomNumber(request.getRoomNumber());
        room.setCapacity(request.getCapacity());
        room.setPricePerNight(request.getPricePerNight());
        room.setDescription(request.getDescription());
        room.setActive(Boolean.TRUE.equals(request.getIsActive()));

        try {
            Room saved = roomRepository.save(room);
            replaceAmenities(saved, request.getAmenityIds());
            return getForAdmin(saved.getId());
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException("Číslo pokoje musí být v rámci hotelu unikátní.");
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public RoomAdminResponse update(Long id, UpdateRoomRequest request) {
        Room room = roomRepository.findAdminRoomById(id)
                .orElseThrow(() -> new NotFoundException("Pokoj nebyl nalezen: " + id));
        RoomType roomType = getRoomTypeForHotel(request.getRoomTypeId(), room.getHotel().getId());

        if (roomRepository.existsByHotelIdAndRoomNumberAndIdNot(
                room.getHotel().getId(), request.getRoomNumber(), room.getId()
        )) {
            throw new ConflictException("Číslo pokoje musí být v rámci hotelu unikátní.");
        }

        room.setRoomType(roomType);
        room.setRoomNumber(request.getRoomNumber());
        room.setCapacity(request.getCapacity());
        room.setPricePerNight(request.getPricePerNight());
        room.setDescription(request.getDescription());
        room.setActive(Boolean.TRUE.equals(request.getIsActive()));

        try {
            Room saved = roomRepository.save(room);
            replaceAmenities(saved, request.getAmenityIds());
            return getForAdmin(saved.getId());
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException("Číslo pokoje musí být v rámci hotelu unikátní.");
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public RoomAdminResponse setActive(Long id, boolean active) {
        Room room = roomRepository.findAdminRoomById(id)
                .orElseThrow(() -> new NotFoundException("Pokoj nebyl nalezen: " + id));
        room.setActive(active);
        Room saved = roomRepository.save(room);
        return getForAdmin(saved.getId());
    }

    private RoomType getRoomTypeForHotel(Long roomTypeId, Long hotelId) {
        RoomType roomType = roomTypeRepository.findRoomTypeById(roomTypeId)
                .orElseThrow(() -> new NotFoundException("Typ pokoje nebyl nalezen: " + roomTypeId));

        if (!roomType.getHotel().getId().equals(hotelId)) {
            throw new ConflictException("Typ pokoje nepatří k vybranému hotelu.");
        }

        return roomType;
    }

    private void replaceAmenities(Room room, List<Long> amenityIds) {
        roomAmenityRepository.deleteByRoomId(room.getId());

        if (amenityIds == null || amenityIds.isEmpty()) {
            return;
        }

        List<Long> distinctIds = amenityIds.stream().distinct().toList();
        List<Amenity> amenities = amenityRepository.findByIds(distinctIds);
        if (amenities.size() != distinctIds.size()) {
            throw new NotFoundException("Některé vybavení nebylo nalezeno.");
        }

        List<RoomAmenity> links = amenities.stream().map((amenity) -> {
            RoomAmenity link = new RoomAmenity();
            link.setId(new RoomAmenityId(room.getId(), amenity.getId()));
            link.setRoom(room);
            link.setAmenity(amenity);
            return link;
        }).toList();

        roomAmenityRepository.saveAll(links);
    }

    private List<RoomAdminResponse> toAdminResponses(List<Room> rooms) {
        if (rooms.isEmpty()) {
            return List.of();
        }

        List<Long> roomIds = rooms.stream().map(Room::getId).toList();
        Map<Long, List<Amenity>> amenitiesByRoom = roomAmenityRepository.findByRoomIds(roomIds)
                .stream()
                .collect(Collectors.groupingBy(
                        ra -> ra.getRoom().getId(),
                        Collectors.mapping(RoomAmenity::getAmenity, Collectors.toList())
                ));

        return rooms.stream()
                .map(room -> RoomAdminResponse.fromEntity(
                        room,
                        amenitiesByRoom.getOrDefault(room.getId(), List.of())
                ))
                .toList();
    }
}
