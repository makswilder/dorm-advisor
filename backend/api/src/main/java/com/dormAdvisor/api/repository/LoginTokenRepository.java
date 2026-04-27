package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.LoginToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface LoginTokenRepository extends JpaRepository<LoginToken, UUID> {

    Optional<LoginToken> findByTokenHash(String tokenHash);

    // Atomic consumption — returns 1 if token was valid and not yet used, 0 otherwise
    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE login_tokens SET used = true WHERE token_hash = :hash AND used = false AND expires_at > now()", nativeQuery = true)
    int consumeToken(@Param("hash") String hash);
}