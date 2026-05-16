package com.algone.reservations.service;

import com.algone.reservations.dto.request.CreatePaymentRequest;
import com.algone.reservations.entity.Payment;
import com.algone.reservations.entity.PaymentMethod;
import com.algone.reservations.entity.PaymentStatus;
import com.algone.reservations.entity.Reservation;
import com.algone.reservations.entity.ReservationStatus;
import com.algone.reservations.entity.User;
import com.algone.reservations.entity.UserRole;
import com.algone.reservations.exception.BusinessException;
import com.algone.reservations.exception.NotFoundException;
import com.algone.reservations.repository.PaymentRepository;
import com.algone.reservations.repository.ReservationRepository;
import com.algone.reservations.repository.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final BigDecimal CASH_DEPOSIT_RATIO = new BigDecimal("0.30");
    private static final Map<PaymentStatus, Set<PaymentStatus>> ALLOWED_TRANSITIONS = Map.of(
            PaymentStatus.PENDING, Set.of(PaymentStatus.PAID, PaymentStatus.FAILED),
            PaymentStatus.PAID, Set.of(PaymentStatus.REFUNDED),
            PaymentStatus.FAILED, Set.of(),
            PaymentStatus.REFUNDED, Set.of()
    );

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<Payment> getPaymentsForReservation(Authentication authentication, Long reservationId) {
        Reservation reservation = getAccessibleReservation(authentication, reservationId);
        return paymentRepository.findByReservation_IdOrderByCreatedAtDesc(reservation.getId());
    }

    @Transactional(rollbackFor = Exception.class)
    public Payment createPayment(Authentication authentication, Long reservationId, CreatePaymentRequest request) {
        Reservation reservation = getAccessibleReservation(authentication, reservationId);

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

    @Transactional(rollbackFor = Exception.class)
    public Payment changeStatus(Long id, PaymentStatus newStatus) {
        Payment payment = paymentRepository.findPaymentById(id)
                .orElseThrow(() -> new NotFoundException("Platba nebyla nalezena: " + id));

        PaymentStatus current = payment.getStatus();
        if (current == newStatus) {
            return payment;
        }

        Set<PaymentStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(current, Set.of());
        if (!allowed.contains(newStatus)) {
            throw new BusinessException("Nepovolený přechod stavu platby: " + current + " → " + newStatus);
        }

        payment.setStatus(newStatus);
        Payment saved = paymentRepository.save(payment);
        entityManager.flush();
        entityManager.refresh(saved);
        return saved;
    }

    private Reservation getAccessibleReservation(Authentication authentication, Long reservationId) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Uživatel nebyl nalezen: " + email));

        Reservation reservation = reservationRepository.findReservationById(reservationId)
                .orElseThrow(() -> new BusinessException("Rezervace nebyla nalezena: " + reservationId));

        if (user.getRole() == UserRole.ADMIN) {
            return reservation;
        }

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new BusinessException("Máte přístup jen ke svým rezervacím.");
        }

        return reservation;
    }
}
