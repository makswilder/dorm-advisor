package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailNormalized(String emailNormalized);

    boolean existsByEmail(String email);
}
