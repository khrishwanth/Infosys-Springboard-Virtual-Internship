package com.example.InsurAI.controller;

import com.example.InsurAI.dto.*;
import com.example.InsurAI.service.AdminDashboardService;
import com.example.InsurAI.service.AdminUserService;
import com.example.InsurAI.service.AppointmentService;
import com.example.InsurAI.dto.CreateAgentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final AdminDashboardService adminDashboardService;
    private final AppointmentService appointmentService;

    // ===================== USERS LIST & MANAGEMENT =====================

    // Used by AdminManagementPanel: GET http://localhost:8080/api/admin/users
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminUserDto>> listAllUsers() {
        return ResponseEntity.ok(adminUserService.listAllUsers());
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserDto> updateRole(
            @PathVariable Long id,
            @RequestBody UpdateUserRoleRequest req
    ) {
        return ResponseEntity.ok(adminUserService.updateUserRole(id, req));
    }

    @PutMapping("/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserDto> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateUserStatusRequest req
    ) {
        return ResponseEntity.ok(adminUserService.updateUserStatus(id, req));
    }

    // -------- New: create agent credentials from admin --------
    @PostMapping("/users/create-agent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserDto> createAgent(
            @RequestBody CreateAgentRequest request
    ) {
        AdminUserDto created = adminUserService.createAgentUser(
                request.getEmail(),
                request.getPassword(),
                "AGENT"
        );
        return ResponseEntity.ok(created);
    }

    // ===================== DASHBOARD SUMMARY =====================

    // Used by frontend: GET http://localhost:8080/api/admin/dashboard/summary
    @GetMapping("/dashboard/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminDashboardSummary getDashboardSummary() {
        return adminDashboardService.getSummary();
    }

    // ===================== DAILY STATS =====================

    // Frontend (AdminDashboardPage) currently calls:
    // /api/admin/users/stats/daily?days=14  and  /api/admin/users/appointments/daily?days=14
    // To keep that working, you can either:
    // 1) Adjust frontend URLs, or
    // 2) Add small wrapper endpoints here that map to these methods.
    // Below keeps your earlier /stats/... URLs used elsewhere AND adds wrappers
    // matching the existing React code.

    // Generic users daily stats (can be used in reports, etc.)
    @GetMapping("/stats/users/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DailyUserStatDto>> dailyUserStats(
            @RequestParam(name = "days", required = false, defaultValue = "14") int days
    ) {
        return ResponseEntity.ok(adminUserService.getDailyUserStats(days));
    }

    @GetMapping("/stats/appointments/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DailyUserStatDto>> dailyAppointmentStats(
            @RequestParam(name = "days", required = false, defaultValue = "14") int days
    ) {
        return ResponseEntity.ok(adminDashboardService.getDailyAppointmentStats(days));
    }

    @GetMapping("/stats/plans/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DailyUserStatDto>> dailyPlanStats(
            @RequestParam(name = "days", required = false, defaultValue = "14") int days
    ) {
        return ResponseEntity.ok(adminDashboardService.getDailyPlanStats(days));
    }

    // ---- Wrapper endpoints matching AdminDashboardPage.js URLs ----

    // GET /api/admin/users/stats/daily?days=14
    @GetMapping("/users/stats/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DailyUserStatDto>> dailyUserStatsForDashboard(
            @RequestParam(name = "days", required = false, defaultValue = "14") int days
    ) {
        return ResponseEntity.ok(adminUserService.getDailyUserStats(days));
    }

    // GET /api/admin/users/appointments/daily?days=14
    @GetMapping("/users/appointments/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DailyUserStatDto>> dailyAppointmentStatsForDashboard(
            @RequestParam(name = "days", required = false, defaultValue = "14") int days
    ) {
        return ResponseEntity.ok(adminDashboardService.getDailyAppointmentStats(days));
    }

    // ===================== RECENT ITEMS FOR DASHBOARD =====================

    // GET /api/admin/users/appointments/recent
    @GetMapping("/users/appointments/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AppointmentResponse> getRecentAppointmentsAdmin() {
        return appointmentService.getRecentAppointmentsForAdmin();
    }

    // GET /api/admin/users/latest
    @GetMapping("/users/latest")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminUserDto> getLatestUsers() {
        return adminUserService.getLatestUsers();
    }

    // Extra: list only agents (if needed by other UIs)
    @GetMapping("/users/agents")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminUserDto> listAgents() {
        return adminUserService.listAgents();
    }
}
