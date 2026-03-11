package com.hospital.repository;

import com.hospital.entity.AvailableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AvailableSlotRepository extends JpaRepository<AvailableSlot, Long> {
    List<AvailableSlot> findByDoctorId(Long doctorId);
    List<AvailableSlot> findByDoctorIdAndDateAndBookedFalse(Long doctorId, LocalDate date);
    List<AvailableSlot> findByDoctorIdAndDate(Long doctorId, LocalDate date);

    @Query("SELECT s FROM AvailableSlot s WHERE s.doctor.id = :doctorId AND s.date >= :fromDate AND s.booked = false ORDER BY s.date, s.startTime")
    List<AvailableSlot> findAvailableSlots(@Param("doctorId") Long doctorId, @Param("fromDate") LocalDate fromDate);
}
