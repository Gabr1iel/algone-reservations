package com.algone.reservations.dto.response;

import com.algone.reservations.entity.Hotel;
import lombok.Getter;

import java.time.LocalTime;

@Getter
public class HotelResponse {

    private Long id;
    private String name;
    private String description;
    private String email;
    private String phone;
    private String addressLine;
    private String city;
    private String zip;
    private String country;
    private LocalTime checkInFrom;
    private LocalTime checkOutUntil;

    public static HotelResponse fromEntity(Hotel hotel) {
        HotelResponse response = new HotelResponse();
        response.id = hotel.getId();
        response.name = hotel.getName();
        response.description = hotel.getDescription();
        response.email = hotel.getEmail();
        response.phone = hotel.getPhone();
        response.addressLine = hotel.getAddressLine();
        response.city = hotel.getCity();
        response.zip = hotel.getZip();
        response.country = hotel.getCountry();
        response.checkInFrom = hotel.getCheckInFrom();
        response.checkOutUntil = hotel.getCheckOutUntil();
        return response;
    }
}
