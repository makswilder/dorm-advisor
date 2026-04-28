package com.dormAdvisor.api.controller;

import com.dormAdvisor.api.domain.dto.HomeDto;
import com.dormAdvisor.api.service.HomeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/public")
public class HomeController {

    private final HomeService homeService;

    @GetMapping("/homepage")
    public ResponseEntity<HomeDto> homepage() {
        log.info("GET /api/public/homepage");
        return ResponseEntity.ok(homeService.getHomepageData());
    }
}