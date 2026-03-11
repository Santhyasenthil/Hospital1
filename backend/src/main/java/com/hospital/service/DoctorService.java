package com.hospital.service;

import com.hospital.dto.DTOs.*;
import com.hospital.entity.AvailableSlot;
import com.hospital.entity.User;
import com.hospital.repository.AvailableSlotRepository;
import com.hospital.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final UserRepository userRepository;
    private final AvailableSlotRepository slotRepository;

    public DoctorService(UserRepository userRepository, AvailableSlotRepository slotRepository) {
        this.userRepository = userRepository;
        this.slotRepository = slotRepository;
    }

    public List<UserDTO> getAllDoctors() {
        return userRepository.findByRole(User.Role.DOCTOR)
                .stream().map(UserDTO::from).collect(Collectors.toList());
    }

    public List<UserDTO> getDoctorsBySpecialization(String specialization) {
        return userRepository.findDoctorsBySpecialization(specialization)
                .stream().map(UserDTO::from).collect(Collectors.toList());
    }

    public List<String> getSpecializations() {
        return userRepository.findAllSpecializations();
    }

    public UserDTO getDoctorById(Long id) {
        User doctor = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return UserDTO.from(doctor);
    }

    @Transactional
    public SlotDTO addSlot(Long doctorId, SlotRequest req) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        AvailableSlot slot = AvailableSlot.builder()
                .doctor(doctor)
                .date(req.getDate())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .booked(false)
                .build();

        slot = slotRepository.save(slot);
        return toSlotDTO(slot, doctor.getName());
    }

    public List<SlotDTO> getDoctorSlots(Long doctorId) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return slotRepository.findByDoctorId(doctorId)
                .stream().map(s -> toSlotDTO(s, doctor.getName())).collect(Collectors.toList());
    }

    public List<SlotDTO> getAvailableSlots(Long doctorId) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return slotRepository.findAvailableSlots(doctorId, LocalDate.now())
                .stream().map(s -> toSlotDTO(s, doctor.getName())).collect(Collectors.toList());
    }

    @Transactional
    public void deleteSlot(Long slotId, Long doctorId) {
        AvailableSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        if (!slot.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException("Not authorized to delete this slot");
        }
        if (slot.isBooked()) {
            throw new RuntimeException("Cannot delete a booked slot");
        }
        slotRepository.delete(slot);
    }

    public List<UserDTO> getAllPatients() {
        return userRepository.findByRole(User.Role.PATIENT)
                .stream().map(UserDTO::from).collect(Collectors.toList());
    }

    private SlotDTO toSlotDTO(AvailableSlot slot, String doctorName) {
        SlotDTO dto = new SlotDTO();
        dto.setId(slot.getId());
        dto.setDoctorId(slot.getDoctor().getId());
        dto.setDoctorName(doctorName);
        dto.setDate(slot.getDate());
        dto.setStartTime(slot.getStartTime());
        dto.setEndTime(slot.getEndTime());
        dto.setBooked(slot.isBooked());
        return dto;
    }
}
