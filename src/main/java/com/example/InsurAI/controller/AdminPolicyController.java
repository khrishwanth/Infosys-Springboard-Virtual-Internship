package com.example.InsurAI.controller;

import com.example.InsurAI.dto.PolicyPlanCreateUpdateRequest;
import com.example.InsurAI.dto.PolicyPlanDto;
import com.example.InsurAI.service.AdminPolicyService;
import com.example.InsurAI.service.AdminPolicyService.PolicyCategoryStat;
import com.example.InsurAI.service.AdminPolicyService.PolicyUsageStat;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/policies")
@RequiredArgsConstructor
public class AdminPolicyController {

    private final AdminPolicyService adminPolicyService;

    @GetMapping("/plans")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PolicyPlanDto>> listAllPlans() {
        return ResponseEntity.ok(adminPolicyService.listAllPlans());
    }

    @PostMapping("/plans")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyPlanDto> createPlan(
            @RequestBody PolicyPlanCreateUpdateRequest request
    ) {
        return ResponseEntity.ok(adminPolicyService.createPlan(request));
    }

    @PutMapping("/plans/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyPlanDto> updatePlan(
            @PathVariable Long id,
            @RequestBody PolicyPlanCreateUpdateRequest request
    ) {
        return ResponseEntity.ok(adminPolicyService.updatePlan(id, request));
    }

    @DeleteMapping("/plans/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        adminPolicyService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/plans/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyPlanDto> updateStatus(
            @PathVariable Long id,
            @RequestParam("active") boolean active
    ) {
        return ResponseEntity.ok(adminPolicyService.updateStatus(id, active));
    }

    // ---- NEW: Policy charts endpoints ----

    @GetMapping("/stats/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PolicyCategoryStat>> getCategoryStats() {
        return ResponseEntity.ok(adminPolicyService.getCategoryStats());
    }

    @GetMapping("/stats/usage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PolicyUsageStat>> getUsageStats() {
        return ResponseEntity.ok(adminPolicyService.getUsageStats());
    }
}
