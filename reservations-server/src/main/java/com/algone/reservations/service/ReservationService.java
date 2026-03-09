package com.algone.reservations.service;

import com.algone.reservations.entity.Reservation;
import com.algone.reservations.entity.ReservationStatus;
import com.algone.reservations.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public Reservation createReservation(Reservation reservation) {
        if (reservation.getStatus() == null) {
            reservation.setStatus(ReservationStatus.CREATED);
        }

        validateReservationDates(reservation);
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found: " + id));
    }

    public Reservation confirmReservation(Long id) {
        Reservation reservation = getReservationById(id);
        changeStatus(reservation, ReservationStatus.CONFIRMED);
        return reservationRepository.save(reservation);
    }

    public Reservation cancelReservation(Long id) {
        Reservation reservation = getReservationById(id);
        changeStatus(reservation, ReservationStatus.CANCELLED);
        return reservationRepository.save(reservation);
    }

    public Reservation completeReservation(Long id) {
        Reservation reservation = getReservationById(id);
        changeStatus(reservation, ReservationStatus.COMPLETED);
        return reservationRepository.save(reservation);
    }

    private void changeStatus(Reservation reservation, ReservationStatus newStatus) {
        ReservationStatus currentStatus = reservation.getStatus();

        if (!isTransitionAllowed(currentStatus, newStatus)) {
            throw new IllegalStateException(
                    "Invalid reservation state transition: " + currentStatus + " -> " + newStatus
            );
        }

        reservation.setStatus(newStatus);
    }

    private boolean isTransitionAllowed(ReservationStatus currentStatus, ReservationStatus newStatus) {
        return switch (currentStatus) {
            case CREATED -> newStatus == ReservationStatus.CONFIRMED
                    || newStatus == ReservationStatus.CANCELLED;
            case CONFIRMED -> newStatus == ReservationStatus.CANCELLED
                    || newStatus == ReservationStatus.COMPLETED;
            case CANCELLED, COMPLETED -> false;
        };
    }

    private void validateReservationDates(Reservation reservation) {
        if (reservation.getFromDate() == null || reservation.getToDate() == null) {
            throw new IllegalArgumentException("Reservation dates must not be null.");
        }

        if (!reservation.getFromDate().isBefore(reservation.getToDate())) {
            throw new IllegalArgumentException("fromDate must be before toDate.");
        }
    }
}