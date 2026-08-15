package com.codepilot.controller;

import com.codepilot.dto.JobRoleDto;
import com.codepilot.dto.JobRoleReadinessDto;
import com.codepilot.security.UserPrincipal;
import com.codepilot.service.MockInterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/job-roles")
public class JobRoleController {

    @Autowired
    private MockInterviewService mockInterviewService;

    @GetMapping
    public ResponseEntity<List<JobRoleDto>> getAllJobRoles() {
        return ResponseEntity.ok(mockInterviewService.getAllJobRoles());
    }

    @GetMapping("/{id}/readiness")
    public ResponseEntity<JobRoleReadinessDto> getJobReadiness(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                               @PathVariable Long id) {
        return ResponseEntity.ok(mockInterviewService.getJobReadiness(userPrincipal.getId(), id));
    }

    @PostMapping("/select")
    public ResponseEntity<Void> selectJobRole(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                               @RequestBody Map<String, Long> payload) {
        Long jobRoleId = payload.get("jobRoleId");
        if (jobRoleId == null) {
            return ResponseEntity.badRequest().build();
        }
        mockInterviewService.selectJobRole(userPrincipal.getId(), jobRoleId);
        return ResponseEntity.ok().build();
    }
}
