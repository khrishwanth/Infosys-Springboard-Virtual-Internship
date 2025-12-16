package com.example.InsurAI.controller;

import com.example.InsurAI.dto.PolicyPlanCreateUpdateRequest;
import com.example.InsurAI.dto.PolicyPlanDto;
import com.example.InsurAI.service.AdminPolicyService;
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

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PolicyPlanDto>> listAll() {
        return ResponseEntity.ok(adminPolicyService.listAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyPlanDto> create(
            @RequestBody PolicyPlanCreateUpdateRequest req
    ) {
        return ResponseEntity.ok(adminPolicyService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyPlanDto> update(
            @PathVariable Long id,
            @RequestBody PolicyPlanCreateUpdateRequest req
    ) {
        return ResponseEntity.ok(adminPolicyService.update(id, req));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyPlanDto> updateStatus(
            @PathVariable Long id,
            @RequestParam("active") boolean active
    ) {
        return ResponseEntity.ok(adminPolicyService.updateStatus(id, active));
    }

    // Public endpoint for PlansPage
    @GetMapping("/public/active")
    public ResponseEntity<List<PolicyPlanDto>> listActivePublic() {
        return ResponseEntity.ok(adminPolicyService.listActive());
    }
}
