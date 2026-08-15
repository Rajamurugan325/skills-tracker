package com.codepilot.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRoleDto {
    private Long id;
    private String name;
    private String description;
    private List<String> skillsRequired;
}
