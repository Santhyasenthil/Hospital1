package com.hospital.dto;

import com.hospital.entity.Appointment;
import com.hospital.entity.User;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class DTOs {

    // ===== Auth DTOs =====
    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private User.Role role;
        private String specialization;
        private String department;
        private String phone;
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String role;
        private Long userId;
        private String name;
        private String email;

        public AuthResponse(String token, String role, Long userId, String name, String email) {
            this.token = token;
            this.role = role;
            this.userId = userId;
            this.name = name;
            this.email = email;
        }
    }

    // ===== User DTOs =====
    @Data
    public static class UserDTO {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String specialization;
        private String department;
        private String phone;
        private LocalDateTime createdAt;

        public static UserDTO from(User user) {
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setRole(user.getRole().name());
            dto.setSpecialization(user.getSpecialization());
            dto.setDepartment(user.getDepartment());
            dto.setPhone(user.getPhone());
            dto.setCreatedAt(user.getCreatedAt());
            return dto;
        }
    }

    // ===== Slot DTOs =====
    @Data
    public static class SlotRequest {
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
    }

    @Data
    public static class SlotDTO {
        private Long id;
        private Long doctorId;
        private String doctorName;
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
        private boolean booked;
    }

    // ===== Appointment DTOs =====
    @Data
    public static class AppointmentRequest {
        private Long doctorId;
        private LocalDate appointmentDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private String notes;
    }

    @Data
    public static class AppointmentDTO {
        private Long id;
        private Long patientId;
        private String patientName;
        private String patientEmail;
        private Long doctorId;
        private String doctorName;
        private String doctorSpecialization;
        private LocalDate appointmentDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private String status;
        private String notes;
        private LocalDateTime createdAt;

        public static AppointmentDTO from(Appointment a) {
            AppointmentDTO dto = new AppointmentDTO();
            dto.setId(a.getId());
            dto.setPatientId(a.getPatient().getId());
            dto.setPatientName(a.getPatient().getName());
            dto.setPatientEmail(a.getPatient().getEmail());
            dto.setDoctorId(a.getDoctor().getId());
            dto.setDoctorName(a.getDoctor().getName());
            dto.setDoctorSpecialization(a.getDoctor().getSpecialization());
            dto.setAppointmentDate(a.getAppointmentDate());
            dto.setStartTime(a.getStartTime());
            dto.setEndTime(a.getEndTime());
            dto.setStatus(a.getStatus().name());
            dto.setNotes(a.getNotes());
            dto.setCreatedAt(a.getCreatedAt());
            return dto;
        }
    }

    // ===== Report DTOs =====
    @Data
    public static class DoctorStats {
        private Long doctorId;
        private String doctorName;
        private String specialization;
        private long totalAppointments;
    }

    @Data
    public static class DashboardStats {
        private long totalPatients;
        private long totalDoctors;
        private long totalAppointments;
        private long todayAppointments;
        private List<DoctorStats> doctorStats;
    }
}
