package com.hospital.config;

import com.hospital.entity.User;
import com.hospital.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (!userRepository.existsByEmail("admin@hospital.com")) {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@hospital.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(User.Role.ADMIN)
                    .department("Administration")
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Default admin created: admin@hospital.com / Admin@123");
        }

        // Create sample doctors if none exist
        if (userRepository.findByRole(User.Role.DOCTOR).isEmpty()) {
            String[][] doctors = {
                {"Dr. Priya Sharma", "priya@hospital.com", "Cardiology", "Cardiology"},
                {"Dr. Rajan Mehta", "rajan@hospital.com", "Neurology", "Neurology"},
                {"Dr. Anitha Kumar", "anitha@hospital.com", "Orthopedics", "Orthopedics"},
                {"Dr. Suresh Patel", "suresh@hospital.com", "Pediatrics", "Pediatrics"},
                {"Dr. Kavita Nair", "kavita@hospital.com", "Dermatology", "Dermatology"},
            };
            for (String[] d : doctors) {
                User doctor = User.builder()
                        .name(d[0])
                        .email(d[1])
                        .password(passwordEncoder.encode("Doctor@123"))
                        .role(User.Role.DOCTOR)
                        .specialization(d[2])
                        .department(d[3])
                        .build();
                userRepository.save(doctor);
            }
            System.out.println("✅ Sample doctors created (password: Doctor@123)");
        }
    }
}
