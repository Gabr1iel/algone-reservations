package com.algone.reservations.repository;

import com.algone.reservations.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {

    @Query("SELECT rt FROM RoomType rt JOIN FETCH rt.hotel WHERE rt.id = :id")
    Optional<RoomType> findRoomTypeById(@Param("id") Long id);

    @Query("SELECT rt FROM RoomType rt JOIN FETCH rt.hotel WHERE rt.hotel.id = :hotelId ORDER BY rt.name")
    List<RoomType> findByHotelId(@Param("hotelId") Long hotelId);
}
