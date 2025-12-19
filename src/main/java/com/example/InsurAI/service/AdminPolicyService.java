package com.example.InsurAI.service;

import com.example.InsurAI.dto.PolicyPlanCreateUpdateRequest;
import com.example.InsurAI.dto.PolicyPlanDto;
import com.example.InsurAI.entity.PolicyPlan;
import com.example.InsurAI.repository.PolicyPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminPolicyService {

    private final PolicyPlanRepository policyPlanRepository;

    @Transactional(readOnly = true)
    public List<PolicyPlanDto> listAllPlans() {
        return policyPlanRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public PolicyPlanDto createPlan(PolicyPlanCreateUpdateRequest req) {
        PolicyPlan plan = new PolicyPlan();
        apply(plan, req);
        PolicyPlan saved = policyPlanRepository.save(plan);
        return toDto(saved);
    }

    @Transactional
    public PolicyPlanDto updatePlan(Long id, PolicyPlanCreateUpdateRequest req) {
        PolicyPlan plan = policyPlanRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy plan not found: " + id));
        apply(plan, req);
        PolicyPlan saved = policyPlanRepository.save(plan);
        return toDto(saved);
    }

    @Transactional
    public PolicyPlanDto updateStatus(Long id, boolean active) {
        PolicyPlan plan = policyPlanRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy plan not found: " + id));
        plan.setActive(active);
        PolicyPlan saved = policyPlanRepository.save(plan);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<PolicyPlanDto> listActive() {
        return policyPlanRepository.findByActiveTrue()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public void deletePlan(Long id) {
        if (!policyPlanRepository.existsById(id)) {
            throw new IllegalArgumentException("Plan not found");
        }
        policyPlanRepository.deleteById(id);
    }

    @Data
    @AllArgsConstructor
    public static class PolicyCategoryStat {
        private String category;
        private long totalPolicies;
    }

    @Data
    @AllArgsConstructor
    public static class PolicyUsageStat {
        private String category;
        private long usageCount;
    }

    @Transactional(readOnly = true)
    public List<PolicyCategoryStat> getCategoryStats() {
        return policyPlanRepository.findCategoryTotals()
                .stream()
                .map(row -> new PolicyCategoryStat(
                        (String) row[0],
                        ((Number) row[1]).longValue()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PolicyUsageStat> getUsageStats() {
        return policyPlanRepository.findCategoryTotals()
                .stream()
                .map(row -> new PolicyUsageStat(
                        (String) row[0],
                        0L
                ))
                .toList();
    }


    private void apply(PolicyPlan plan, PolicyPlanCreateUpdateRequest req) {
        plan.setName(req.getName());
        plan.setCategory(req.getCategory());
        plan.setPremiumAmount(req.getPremiumAmount());
        plan.setCoverageAmount(req.getCoverageAmount());
        plan.setActive(req.isActive());
        plan.setDescription(req.getDescription());
    }

    private PolicyPlanDto toDto(PolicyPlan plan) {
        return new PolicyPlanDto(
                plan.getId(),
                plan.getName(),
                plan.getCategory(),
                plan.getPremiumAmount(),
                plan.getCoverageAmount(),
                plan.isActive(),
                plan.getDescription()
        );
    }
}
