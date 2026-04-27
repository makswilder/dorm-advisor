package com.dormAdvisor.api.domain.dto.auth;

public record AuthResponseDto(String token, boolean verified) {}