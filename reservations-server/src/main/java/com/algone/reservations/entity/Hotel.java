package com.algone.reservations.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity /** Označí třídu jako DB entitu, respektive že tahle třída mapuje tabulku databáze */
@Table(name = "hotels") /** Specifikuje kterou tabulku entita mapuje */
@Getter  /** Tahle anotace zajišťuje že každý attribut dostane svůj getter, takže místo psaní: public String getName() {} stačí napsat tohle nad třídu a je to globální pro všechny attributy té třídy */
@Setter /** Funguje stejně ale pro Setter */
@NoArgsConstructor /** Říká že třída má prázdný konstruktor, nahrazuje psaní: public Hotel() {} */
public class Hotel {

    @Id /** Označí attribut jako prímární klíč */
    @GeneratedValue(strategy = GenerationType.IDENTITY) /** Specifikuje jak se hodnota generuje, tenhle případ odpovídá auto increment */
    private Long id;

    @Column(nullable = false) /** Tohle umožňuje konfigurovat sloupce, délku, název, nullable atd... */
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "address_line", nullable = false)
    private String addressLine;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 20)
    private String zip;

    @Column(nullable = false, length = 100)
    private String country;

    @Column(name = "check_in_from", nullable = false)
    private LocalTime checkInFrom;

    @Column(name = "check_out_until", nullable = false)
    private LocalTime checkOutUntil;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
