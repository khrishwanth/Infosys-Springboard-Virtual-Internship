package com.example.InsurAI.service;

import com.example.InsurAI.dto.AdminDashboardSummary;
import com.example.InsurAI.entity.Appointment;
import com.example.InsurAI.entity.PolicyPlan;
import com.example.InsurAI.entity.User;
import com.example.InsurAI.entity.UserRole;
import com.example.InsurAI.repository.AppointmentRepository;
import com.example.InsurAI.repository.PolicyPlanRepository;
import com.example.InsurAI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final PolicyPlanRepository policyPlanRepository;

    public AdminDashboardSummary getSummary() {
        ZoneId zone = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zone);
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime startOf7DaysAgo = today.minusDays(6).atStartOfDay();

        long totalAppointmentsToday =
                appointmentRepository.countByScheduledAtBetween(
                        startOfToday,
                        startOfToday.plusDays(1)
                );

        long totalAppointmentsLast7Days =
                appointmentRepository.countByScheduledAtBetween(
                        startOf7DaysAgo,
                        startOfToday.plusDays(1)
                );

        long totalAppointmentsAllTime =
                appointmentRepository.count();

        long totalActiveCustomers =
                userRepository.countByRoleAndEnabled(UserRole.CUSTOMER, true);

        long totalActiveAgents =
                userRepository.countByRoleAndEnabled(UserRole.AGENT, true);

        long totalActivePlans =
                policyPlanRepository.countByActiveTrue();

        return new AdminDashboardSummary(
                totalAppointmentsToday,
                totalAppointmentsLast7Days,
                totalAppointmentsAllTime,
                totalActiveCustomers,
                totalActiveAgents,
                totalActivePlans
        );
    }
}
