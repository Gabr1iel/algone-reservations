package com.algone.reservations.service;

import com.algone.reservations.dto.request.CreateReservationRequest;
import com.algone.reservations.entity.Reservation;
import com.algone.reservations.entity.ReservationStatus;
import com.algone.reservations.entity.Room;
import com.algone.reservations.entity.User;
import com.algone.reservations.repository.ReservationRepository;
import com.algone.reservations.repository.RoomRepository;
import com.algone.reservations.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public List<Reservation> getMyReservations(Authentication authentication) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        return reservationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId());
    }

    public Reservation createReservation(Authentication authentication, CreateReservationRequest request) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        if (request.getCheckIn() == null || request.getCheckOut() == null) {
            throw new RuntimeException("Check-in and check-out are required");
        }

        if (!request.getCheckIn().isBefore(request.getCheckOut())) {
            throw new RuntimeException("Check-in must be before check-out");
        }

        Room room = roomRepository.findRoomById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Active room not found: " + request.getRoomId()));

        boolean overlaps = reservationRepository.existsOverlappingReservation(
                room.getId(),
                request.getCheckIn(),
                request.getCheckOut(),
                ReservationStatus.CANCELLED
        );

        if (overlaps) {
            throw new RuntimeException("Room is already reserved for the selected dates");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setRoom(room);
        reservation.setCheckIn(request.getCheckIn());
        reservation.setCheckOut(request.getCheckOut());
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setTotalPrice(totalPrice);
        reservation.setNote(request.getNote());

        return reservationRepository.save(reservation);
    }

    public Reservation cancelReservation(Authentication authentication, Long reservationId) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + reservationId));

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can cancel only your own reservations");
        }

        if (reservation.getStatus() != ReservationStatus.PENDING
                && reservation.getStatus() != ReservationStatus.CONFIRMED) {
            throw new RuntimeException("Only pending or confirmed reservations can be cancelled");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        return reservationRepository.save(reservation);
    }
}