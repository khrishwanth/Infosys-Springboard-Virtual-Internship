package com.example.InsurAI.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PolicyPlanCreateUpdateRequest {
    private String name;
    private String category;
    private BigDecimal premiumAmount;
    private BigDecimal coverageAmount;
    private boolean active = true;
    private String description;
}
