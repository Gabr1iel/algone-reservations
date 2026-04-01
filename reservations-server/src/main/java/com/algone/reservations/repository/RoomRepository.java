package com.algone.reservations.repository;

import com.algone.reservations.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("SELECT DISTINCT r FROM Room r JOIN FETCH r.roomType WHERE r.id = :id AND r.active = true")
    Optional<Room> findRoomById(@Param("id")  Long id);

    @Query("""
            SELECT DISTINCT r FROM Room r
            JOIN FETCH r.roomType
            WHERE r.hotel.id = :hotelId
            AND r.active = true
            AND (:minCapacity = 0 OR r.capacity >= :minCapacity)
            AND (:minPrice IS NULL OR r.pricePerNight >= :minPrice)
            AND (:maxPrice IS NULL OR r.pricePerNight <= :maxPrice)
            AND (:roomTypeId = 0 OR r.roomType.id = :roomTypeId)
            ORDER BY r.roomType.name, r.roomNumber
            """)
    List<Room> findRoomsFiltered(
            @Param("hotelId") Long hotelId,
            @Param("minCapacity") int minCapacity,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("roomTypeId") long roomTypeId
    );
}
