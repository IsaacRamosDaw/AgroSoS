package com.agroSoSProyect.Repository;
// Qué hace el jpaRepository
import com.agroSoSProyect.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
// Qué hace el stereotype Repository
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Qué hace el @Repository
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  User findByEmail(String email);
}