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
            reservation.setStatus(ReservationStatus.PENDING);
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
            case PENDING -> newStatus == ReservationStatus.CONFIRMED
                    || newStatus == ReservationStatus.CANCELLED;
            case CONFIRMED -> newStatus == ReservationStatus.CHECKED_IN
                    || newStatus == ReservationStatus.CANCELLED;
            case CHECKED_IN -> newStatus == ReservationStatus.COMPLETED
                    || newStatus == ReservationStatus.CANCELLED;
            case COMPLETED, CANCELLED -> false;
        };
    }

    private void validateReservationDates(Reservation reservation) {
        if (reservation.getCheckIn() == null || reservation.getCheckOut() == null) {
            throw new IllegalArgumentException("Reservation dates must not be null.");
        }

        if (!reservation.getCheckIn().isBefore(reservation.getCheckOut())) {
            throw new IllegalArgumentException("Check-in date must be before check-out date.");
        }
    }
}
