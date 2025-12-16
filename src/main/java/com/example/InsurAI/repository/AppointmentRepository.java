package com.example.InsurAI.repository;

import com.example.InsurAI.entity.Appointment;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByCustomerIdOrderByScheduledAtDesc(Long customerId);

    List<Appointment> findByAgentIdOrderByScheduledAtDesc(Long agentId);

    long countByScheduledAtBetween(LocalDateTime start, LocalDateTime end);

    List<Appointment> findTop10ByOrderByCreatedAtDesc();
}
