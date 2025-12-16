package com.example.InsurAI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class PolicyPlanDto {
    private Long id;
    private String name;
    private String category;
    private BigDecimal premiumAmount;
    private BigDecimal coverageAmount;
    private boolean active;
    private String description;
}
