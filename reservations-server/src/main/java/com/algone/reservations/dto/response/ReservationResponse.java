package com.algone.reservations.dto.response;

import com.algone.reservations.entity.Reservation;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class ReservationResponse {

    private Long id;
    private Long roomId;
    private String roomNumber;
    private Long hotelId;
    private String hotelName;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String status;
    private BigDecimal totalPrice;
    private String note;
    private LocalDateTime createdAt;

    public static ReservationResponse fromEntity(Reservation reservation) {
        ReservationResponse response = new ReservationResponse();
        response.id = reservation.getId();
        response.roomId = reservation.getRoom() != null ? reservation.getRoom().getId() : null;
        response.roomNumber = reservation.getRoom() != null ? reservation.getRoom().getRoomNumber() : null;
        response.hotelId = reservation.getRoom() != null && reservation.getRoom().getHotel() != null
                ? reservation.getRoom().getHotel().getId()
                : null;
        response.hotelName = reservation.getRoom() != null && reservation.getRoom().getHotel() != null
                ? reservation.getRoom().getHotel().getName()
                : null;
        response.checkIn = reservation.getCheckIn();
        response.checkOut = reservation.getCheckOut();
        response.status = reservation.getStatus() != null ? reservation.getStatus().name() : null;
        response.totalPrice = reservation.getTotalPrice();
        response.note = reservation.getNote();
        response.createdAt = reservation.getCreatedAt();
        return response;
    }
}