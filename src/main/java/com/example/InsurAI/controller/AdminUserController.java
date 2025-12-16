package com.example.InsurAI.controller;

import com.example.InsurAI.dto.*;
import com.example.InsurAI.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.InsurAI.service.AdminDashboardService;
import com.example.InsurAI.service.AppointmentService;
import com.example.InsurAI.dto.AppointmentResponse;
import java.util.List;


@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final AdminDashboardService adminDashboardService;
    private final AppointmentService appointmentService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminUserDto>> listAll() {
        return ResponseEntity.ok(adminUserService.listAllUsers());
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserDto> updateRole(
            @PathVariable Long id,
            @RequestBody UpdateUserRoleRequest req
    ) {
        return ResponseEntity.ok(adminUserService.updateUserRole(id, req));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserDto> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateUserStatusRequest req
    ) {
        return ResponseEntity.ok(adminUserService.updateUserStatus(id, req));
    }

    @GetMapping("/stats/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DailyUserStatDto>> dailyStats(
            @RequestParam(name = "days", required = false, defaultValue = "14") int days
    ) {
        return ResponseEntity.ok(adminUserService.getDailyUserStats(days));
    }

    @GetMapping("/dashboard/summary")
    public AdminDashboardSummary getDashboardSummary() {
        return adminDashboardService.getSummary();
    }

    @GetMapping("/appointments/recent")
    public List<AppointmentResponse> getRecentAppointmentsAdmin() {
        return appointmentService.getRecentAppointmentsForAdmin();
    }

    @GetMapping("/latest")
    public List<AdminUserDto> getLatestUsers() {
        return adminUserService.getLatestUsers();
    }

    @GetMapping("/agents")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminUserDto> listAgents() {
        return adminUserService.listAgents();
    }

}
