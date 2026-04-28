package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.enums.ForumThreadType;

public record ForumThreadCreateDto(String title, ForumThreadType type) {}