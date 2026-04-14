package com.algone.reservations.repository;

import com.algone.reservations.entity.Reservation;
import com.algone.reservations.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("""
            SELECT DISTINCT res.room.id FROM Reservation res
            WHERE res.room.id IN :roomIds
            AND res.status <> :cancelled
            AND res.checkIn < :checkOut
            AND res.checkOut > :checkIn
            """)
    List<Long> findBookedRoomIds(
            @Param("roomIds") List<Long> roomIds,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("cancelled") ReservationStatus cancelled
    );

    List<Reservation> findByUser_IdOrderByCreatedAtDesc(Long userId);

    @Query("""
            SELECT COUNT(res) > 0 FROM Reservation res
            WHERE res.room.id = :roomId
            AND res.status <> :cancelled
            AND res.checkIn < :checkOut
            AND res.checkOut > :checkIn
            """)
    boolean existsOverlappingReservation(
            @Param("roomId") Long roomId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("cancelled") ReservationStatus cancelled
    );
}