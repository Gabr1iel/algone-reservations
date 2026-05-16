package com.algone.reservations.controller;

import com.algone.reservations.dto.request.CreateRoomRequest;
import com.algone.reservations.dto.request.SetRoomActiveRequest;
import com.algone.reservations.dto.request.UpdateRoomRequest;
import com.algone.reservations.dto.response.RoomAdminResponse;
import com.algone.reservations.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/rooms")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminRoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(@RequestParam(required = false) Long hotelId) {
        List<RoomAdminResponse> rooms = roomService.getAllForAdmin(hotelId);
        return ResponseEntity.ok(Map.of("rooms", rooms));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomAdminResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getForAdmin(id));
    }

    @PostMapping
    public ResponseEntity<RoomAdminResponse> create(@Valid @RequestBody CreateRoomRequest request) {
        RoomAdminResponse room = roomService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomAdminResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoomRequest request
    ) {
        return ResponseEntity.ok(roomService.update(id, request));
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<RoomAdminResponse> setActive(
            @PathVariable Long id,
            @Valid @RequestBody SetRoomActiveRequest request
    ) {
        return ResponseEntity.ok(roomService.setActive(id, request.getActive()));
    }
}
