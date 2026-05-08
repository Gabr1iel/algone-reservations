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

    @Query("""
            SELECT r FROM Reservation r
            JOIN FETCH r.room rm
            JOIN FETCH rm.hotel
            WHERE r.user.id = :userId
            ORDER BY r.createdAt DESC
            """)
    List<Reservation> findByUser_IdOrderByCreatedAtDesc(@Param("userId") Long userId);

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

    @Query("""
            SELECT r FROM Reservation r
            JOIN FETCH r.user u
            JOIN FETCH r.room rm
            JOIN FETCH rm.hotel
            ORDER BY r.createdAt DESC
            """)
    List<Reservation> findAllForAdmin();

    @Query("""
            SELECT r FROM Reservation r
            JOIN FETCH r.user u
            JOIN FETCH r.room rm
            JOIN FETCH rm.hotel
            WHERE r.status = :status
            ORDER BY r.createdAt DESC
            """)
    List<Reservation> findAllForAdminByStatus(@Param("status") ReservationStatus status);
}