package com.algone.reservations.repository;

import com.algone.reservations.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByReservation_IdOrderByCreatedAtDesc(Long reservationId);
}