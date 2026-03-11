package com.hospital.controller;

import com.hospital.dto.DTOs.*;
import com.hospital.security.JwtUtil;
import com.hospital.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final JwtUtil jwtUtil;

    public AppointmentController(AppointmentService appointmentService, JwtUtil jwtUtil) {
        this.appointmentService = appointmentService;
        this.jwtUtil = jwtUtil;
    }

    private Long getUserIdFromToken(String authHeader) {
        return jwtUtil.extractUserId(authHeader.substring(7));
    }

    private String getRoleFromToken(String authHeader) {
        return jwtUtil.extractRole(authHeader.substring(7));
    }

    @PostMapping("/book")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> bookAppointment(@RequestHeader("Authorization") String auth,
                                              @RequestBody AppointmentRequest req) {
        try {
            Long patientId = getUserIdFromToken(auth);
            return ResponseEntity.ok(appointmentService.bookAppointment(patientId, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyAppointments(@RequestHeader("Authorization") String auth) {
        try {
            Long userId = getUserIdFromToken(auth);
            String role = getRoleFromToken(auth);
            if ("PATIENT".equals(role)) {
                return ResponseEntity.ok(appointmentService.getPatientAppointments(userId));
            } else if ("DOCTOR".equals(role)) {
                return ResponseEntity.ok(appointmentService.getDoctorAppointments(userId));
            } else {
                return ResponseEntity.ok(appointmentService.getAllAppointments());
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/confirm")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> confirmAppointment(@PathVariable Long id,
                                                 @RequestHeader("Authorization") String auth) {
        try {
            Long doctorId = getUserIdFromToken(auth);
            return ResponseEntity.ok(appointmentService.confirmAppointment(id, doctorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> completeAppointment(@PathVariable Long id,
                                                  @RequestHeader("Authorization") String auth) {
        try {
            Long doctorId = getUserIdFromToken(auth);
            return ResponseEntity.ok(appointmentService.completeAppointment(id, doctorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id,
                                                @RequestHeader("Authorization") String auth) {
        try {
            Long userId = getUserIdFromToken(auth);
            String role = getRoleFromToken(auth);
            return ResponseEntity.ok(appointmentService.cancelAppointment(id, userId, role));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(appointmentService.getDashboardStats());
    }
}
