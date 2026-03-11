package com.hospital.controller;

import com.hospital.dto.DTOs.*;
import com.hospital.security.JwtUtil;
import com.hospital.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DoctorController {

    private final DoctorService doctorService;
    private final JwtUtil jwtUtil;

    public DoctorController(DoctorService doctorService, JwtUtil jwtUtil) {
        this.doctorService = doctorService;
        this.jwtUtil = jwtUtil;
    }

    private Long getUserIdFromToken(String authHeader) {
        return jwtUtil.extractUserId(authHeader.substring(7));
    }

    // Public endpoints
    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctors(@RequestParam(required = false) String specialization) {
        if (specialization != null && !specialization.isEmpty()) {
            return ResponseEntity.ok(doctorService.getDoctorsBySpecialization(specialization));
        }
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<?> getDoctor(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(doctorService.getDoctorById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/specializations")
    public ResponseEntity<?> getSpecializations() {
        return ResponseEntity.ok(doctorService.getSpecializations());
    }

    @GetMapping("/slots/{doctorId}/available")
    public ResponseEntity<?> getAvailableSlots(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getAvailableSlots(doctorId));
    }

    // Doctor-only endpoints
    @PostMapping("/doctor/slots")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> addSlot(@RequestHeader("Authorization") String auth,
                                      @RequestBody SlotRequest req) {
        try {
            Long doctorId = getUserIdFromToken(auth);
            return ResponseEntity.ok(doctorService.addSlot(doctorId, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/doctor/slots")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<?> getDoctorSlots(@RequestHeader("Authorization") String auth) {
        Long doctorId = getUserIdFromToken(auth);
        return ResponseEntity.ok(doctorService.getDoctorSlots(doctorId));
    }

    @DeleteMapping("/doctor/slots/{slotId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> deleteSlot(@PathVariable Long slotId,
                                         @RequestHeader("Authorization") String auth) {
        try {
            Long doctorId = getUserIdFromToken(auth);
            doctorService.deleteSlot(slotId, doctorId);
            return ResponseEntity.ok(Map.of("message", "Slot deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Admin endpoints
    @GetMapping("/admin/patients")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllPatients() {
        return ResponseEntity.ok(doctorService.getAllPatients());
    }

    @GetMapping("/admin/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllDoctorsAdmin() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }
}
