package com.algone.reservations.dto.response;

import com.algone.reservations.entity.Hotel;
import java.time.LocalTime;

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

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getAddressLine() { return addressLine; }
    public String getCity() { return city; }
    public String getZip() { return zip; }
    public String getCountry() { return country; }
    public LocalTime getCheckInFrom() { return checkInFrom; }
    public LocalTime getCheckOutUntil() { return checkOutUntil; }
}
