package com.algone.reservations.repository;

import com.algone.reservations.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AmenityRepository extends JpaRepository<Amenity, Long> {

    @Query("SELECT a FROM Amenity a ORDER BY a.name")
    List<Amenity> findAllOrderedByName();

    @Query("SELECT a FROM Amenity a WHERE a.id IN :ids ORDER BY a.name")
    List<Amenity> findByIds(@Param("ids") List<Long> ids);
}
