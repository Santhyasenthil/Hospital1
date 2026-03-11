package com.hospital.service;

import com.hospital.dto.DTOs.*;
import com.hospital.entity.Appointment;
import com.hospital.entity.AvailableSlot;
import com.hospital.entity.User;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.AvailableSlotRepository;
import com.hospital.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final AvailableSlotRepository slotRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                               UserRepository userRepository,
                               AvailableSlotRepository slotRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.slotRepository = slotRepository;
    }

    @Transactional
    public AppointmentDTO bookAppointment(Long patientId, AppointmentRequest req) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        User doctor = userRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Business Rule: Cannot book overlapping time slots
        if (appointmentRepository.existsOverlappingDoctorAppointment(
                req.getDoctorId(), req.getAppointmentDate(), req.getStartTime(), req.getEndTime())) {
            throw new RuntimeException("Doctor already has an appointment during this time slot");
        }

        // Business Rule: Patient cannot book multiple appointments at same time
        if (appointmentRepository.existsOverlappingPatientAppointment(
                patientId, req.getAppointmentDate(), req.getStartTime(), req.getEndTime())) {
            throw new RuntimeException("You already have an appointment during this time slot");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(req.getAppointmentDate())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .notes(req.getNotes())
                .status(Appointment.Status.BOOKED)
                .build();

        // Mark slot as booked
        List<AvailableSlot> slots = slotRepository.findByDoctorIdAndDateAndBookedFalse(
                req.getDoctorId(), req.getAppointmentDate());
        slots.stream()
                .filter(s -> s.getStartTime().equals(req.getStartTime()) && s.getEndTime().equals(req.getEndTime()))
                .findFirst()
                .ifPresent(s -> { s.setBooked(true); slotRepository.save(s); });

        return AppointmentDTO.from(appointmentRepository.save(appointment));
    }

    public List<AppointmentDTO> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId)
                .stream().map(AppointmentDTO::from).collect(Collectors.toList());
    }

    public List<AppointmentDTO> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId)
                .stream().map(AppointmentDTO::from).collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream().map(AppointmentDTO::from).collect(Collectors.toList());
    }

    // Business Rule: Only DOCTOR can confirm
    @Transactional
    public AppointmentDTO confirmAppointment(Long appointmentId, Long doctorId) {
        Appointment a = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        if (!a.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException("Only the assigned doctor can confirm this appointment");
        }
        if (a.getStatus() != Appointment.Status.BOOKED) {
            throw new RuntimeException("Only BOOKED appointments can be confirmed");
        }
        a.setStatus(Appointment.Status.CONFIRMED);
        return AppointmentDTO.from(appointmentRepository.save(a));
    }

    // Business Rule: Only ADMIN can cancel after confirmation
    @Transactional
    public AppointmentDTO cancelAppointment(Long appointmentId, Long userId, String role) {
        Appointment a = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (a.getStatus() == Appointment.Status.CONFIRMED && !role.equals("ADMIN")) {
            throw new RuntimeException("Only ADMIN can cancel confirmed appointments");
        }
        if (a.getStatus() == Appointment.Status.BOOKED &&
                !role.equals("ADMIN") && !a.getPatient().getId().equals(userId)) {
            throw new RuntimeException("You can only cancel your own appointments");
        }

        a.setStatus(Appointment.Status.CANCELLED);

        // Free up the slot
        List<AvailableSlot> slots = slotRepository.findByDoctorIdAndDate(
                a.getDoctor().getId(), a.getAppointmentDate());
        slots.stream()
                .filter(s -> s.getStartTime().equals(a.getStartTime()))
                .findFirst()
                .ifPresent(s -> { s.setBooked(false); slotRepository.save(s); });

        return AppointmentDTO.from(appointmentRepository.save(a));
    }

    @Transactional
    public AppointmentDTO completeAppointment(Long appointmentId, Long doctorId) {
        Appointment a = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        if (!a.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException("Only the assigned doctor can complete this appointment");
        }
        if (a.getStatus() != Appointment.Status.CONFIRMED) {
            throw new RuntimeException("Only CONFIRMED appointments can be completed");
        }
        a.setStatus(Appointment.Status.COMPLETED);
        return AppointmentDTO.from(appointmentRepository.save(a));
    }

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalPatients(userRepository.findByRole(User.Role.PATIENT).size());
        stats.setTotalDoctors(userRepository.findByRole(User.Role.DOCTOR).size());
        stats.setTotalAppointments(appointmentRepository.count());
        stats.setTodayAppointments(
            appointmentRepository.findAppointmentsBetweenDates(LocalDate.now(), LocalDate.now()).size()
        );

        List<DoctorStats> doctorStats = userRepository.findByRole(User.Role.DOCTOR)
                .stream().map(d -> {
                    DoctorStats ds = new DoctorStats();
                    ds.setDoctorId(d.getId());
                    ds.setDoctorName(d.getName());
                    ds.setSpecialization(d.getSpecialization());
                    ds.setTotalAppointments(appointmentRepository.countByDoctorId(d.getId()));
                    return ds;
                }).collect(Collectors.toList());
        stats.setDoctorStats(doctorStats);
        return stats;
    }
}
