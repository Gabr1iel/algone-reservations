package com.algone.reservations.repository;

import com.algone.reservations.entity.RoomAmenity;
import com.algone.reservations.entity.RoomAmenityId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoomAmenityRepository extends JpaRepository<RoomAmenity, RoomAmenityId> {
    @Query("SELECT ra FROM RoomAmenity ra JOIN FETCH ra.amenity WHERE ra.room.id IN :roomIds")
    List<RoomAmenity> findByRoomIds(@Param("roomIds")  List<Long> roomIds);
}
