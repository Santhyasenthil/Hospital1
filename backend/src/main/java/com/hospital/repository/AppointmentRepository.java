package com.hospital.repository;

import com.hospital.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);

    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentDate = :date " +
           "AND a.status NOT IN ('CANCELLED') " +
           "AND ((a.startTime < :endTime AND a.endTime > :startTime))")
    boolean existsOverlappingDoctorAppointment(
        @Param("doctorId") Long doctorId,
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );

    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.patient.id = :patientId " +
           "AND a.appointmentDate = :date " +
           "AND a.status NOT IN ('CANCELLED') " +
           "AND ((a.startTime < :endTime AND a.endTime > :startTime))")
    boolean existsOverlappingPatientAppointment(
        @Param("patientId") Long patientId,
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId AND a.status NOT IN ('CANCELLED')")
    Long countByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT a.doctor.department, COUNT(a) FROM Appointment a WHERE a.status = 'COMPLETED' GROUP BY a.doctor.department")
    List<Object[]> countAppointmentsByDepartment();

    List<Appointment> findByStatus(Appointment.Status status);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :start AND :end ORDER BY a.appointmentDate, a.startTime")
    List<Appointment> findAppointmentsBetweenDates(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
