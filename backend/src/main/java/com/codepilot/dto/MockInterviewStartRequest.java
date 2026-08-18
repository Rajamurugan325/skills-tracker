package com.codepilot.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockInterviewStartRequest {
    private String type; // INDIVIDUAL, MULTIPLE, TECHNICAL, PLACEMENT, COMPANY
    private List<String> skills; // list of categories
    private String companyStyle; // Google, TCS, Amazon
}
