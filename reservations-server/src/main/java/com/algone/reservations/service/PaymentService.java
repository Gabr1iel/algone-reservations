package com.algone.reservations.service;

import com.algone.reservations.dto.request.CreatePaymentRequest;
import com.algone.reservations.entity.Payment;
import com.algone.reservations.entity.PaymentStatus;
import com.algone.reservations.entity.Reservation;
import com.algone.reservations.entity.User;
import com.algone.reservations.repository.PaymentRepository;
import com.algone.reservations.repository.ReservationRepository;
import com.algone.reservations.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    public List<Payment> getPaymentsForReservation(Authentication authentication, Long reservationId) {
        Reservation reservation = getOwnedReservation(authentication, reservationId);
        return paymentRepository.findByReservation_IdOrderByCreatedAtDesc(reservation.getId());
    }

    public Payment createPayment(Authentication authentication, Long reservationId, CreatePaymentRequest request) {
        Reservation reservation = getOwnedReservation(authentication, reservationId);

        Payment payment = new Payment();
        payment.setReservation(reservation);
        payment.setAmount(reservation.getTotalPrice());
        payment.setCurrency("CZK");
        payment.setMethod(request.getMethod());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setProviderRef(null);
        payment.setPaidAt(null);

        return paymentRepository.save(payment);
    }

    private Reservation getOwnedReservation(Authentication authentication, Long reservationId) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + reservationId));

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can access only your own reservation payments");
        }

        return reservation;
    }
}