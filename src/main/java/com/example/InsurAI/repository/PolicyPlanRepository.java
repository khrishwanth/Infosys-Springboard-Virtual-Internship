package com.example.InsurAI.repository;

import com.example.InsurAI.entity.PolicyPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PolicyPlanRepository extends JpaRepository<PolicyPlan, Long> {

    List<PolicyPlan> findByActiveTrue();

    long countByActiveTrue();
}
