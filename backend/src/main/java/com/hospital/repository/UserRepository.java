package com.hospital.repository;

import com.hospital.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(User.Role role);
    
    @Query("SELECT u FROM User u WHERE u.role = 'DOCTOR' AND (:specialization IS NULL OR u.specialization = :specialization)")
    List<User> findDoctorsBySpecialization(String specialization);
    
    @Query("SELECT DISTINCT u.specialization FROM User u WHERE u.role = 'DOCTOR' AND u.specialization IS NOT NULL")
    List<String> findAllSpecializations();
}
