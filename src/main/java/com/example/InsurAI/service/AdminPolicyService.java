package com.example.InsurAI.service;

import com.example.InsurAI.dto.PolicyPlanCreateUpdateRequest;
import com.example.InsurAI.dto.PolicyPlanDto;
import com.example.InsurAI.entity.PolicyPlan;
import com.example.InsurAI.repository.PolicyPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminPolicyService {

    private final PolicyPlanRepository policyPlanRepository;

    @Transactional(readOnly = true)
    public List<PolicyPlanDto> listAll() {
        return policyPlanRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public PolicyPlanDto create(PolicyPlanCreateUpdateRequest req) {
        PolicyPlan plan = new PolicyPlan();
        apply(plan, req);
        PolicyPlan saved = policyPlanRepository.save(plan);
        return toDto(saved);
    }

    @Transactional
    public PolicyPlanDto update(Long id, PolicyPlanCreateUpdateRequest req) {
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
