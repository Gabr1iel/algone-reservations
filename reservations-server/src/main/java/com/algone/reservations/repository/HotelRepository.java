package com.algone.reservations.repository;

import com.algone.reservations.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    @Query("SELECT h FROM Hotel h WHERE h.id = :id")
    Optional<Hotel> findHotelById(@Param("id") Long id);

    @Query("SELECT DISTINCT h FROM Hotel h")
    List<Hotel> findAllHotels();
}
