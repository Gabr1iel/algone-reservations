package com.algone.reservations.repository;

import com.algone.reservations.entity.Payment;
import com.algone.reservations.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("""
            SELECT p FROM Payment p
            WHERE p.reservation.id = :reservationId
            ORDER BY p.createdAt DESC
            """)
    List<Payment> findByReservation_IdOrderByCreatedAtDesc(@Param("reservationId") Long reservationId);

    @Query("""
            SELECT COUNT(p) > 0 FROM Payment p
            WHERE p.reservation.id = :reservationId
            AND p.status = :status
            """)
    boolean existsByReservationIdAndStatus(
            @Param("reservationId") Long reservationId,
            @Param("status") PaymentStatus status
    );
}
