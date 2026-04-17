package com.algone.reservations.service;

import com.algone.reservations.dto.request.CreatePaymentRequest;
import com.algone.reservations.entity.Payment;
import com.algone.reservations.entity.PaymentMethod;
import com.algone.reservations.entity.PaymentStatus;
import com.algone.reservations.entity.Reservation;
import com.algone.reservations.entity.ReservationStatus;
import com.algone.reservations.entity.User;
import com.algone.reservations.exception.BusinessException;
import com.algone.reservations.repository.PaymentRepository;
import com.algone.reservations.repository.ReservationRepository;
import com.algone.reservations.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final BigDecimal CASH_DEPOSIT_RATIO = new BigDecimal("0.30");

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    public List<Payment> getPaymentsForReservation(Authentication authentication, Long reservationId) {
        Reservation reservation = getOwnedReservation(authentication, reservationId);
        return paymentRepository.findByReservation_IdOrderByCreatedAtDesc(reservation.getId());
    }

    @Transactional
    public Payment createPayment(Authentication authentication, Long reservationId, CreatePaymentRequest request) {
        Reservation reservation = getOwnedReservation(authentication, reservationId);

        if (paymentRepository.existsByReservationIdAndStatus(reservation.getId(), PaymentStatus.PAID)) {
            throw new BusinessException("Rezervace už byla zaplacena.");
        }

        PaymentMethod method = request.getMethod();
        BigDecimal amount = method == PaymentMethod.CASH
                ? reservation.getTotalPrice().multiply(CASH_DEPOSIT_RATIO)
                : reservation.getTotalPrice();

        Payment payment = new Payment();
        payment.setReservation(reservation);
        payment.setAmount(amount);
        payment.setCurrency("CZK");
        payment.setMethod(method);
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        payment.setProviderRef(null);

        Payment saved = paymentRepository.save(payment);

        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservationRepository.save(reservation);

        return saved;
    }

    private Reservation getOwnedReservation(Authentication authentication, Long reservationId) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Uživatel nebyl nalezen: " + email));

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException("Rezervace nebyla nalezena: " + reservationId));

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new BusinessException("Máte přístup jen ke svým rezervacím.");
        }

        return reservation;
    }
}
