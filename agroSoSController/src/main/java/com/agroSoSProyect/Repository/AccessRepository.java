package com.agroSoSProyect.Repository;

import com.agroSoSProyect.Models.Access;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccessRepository extends JpaRepository<Access, Long> {
  List<Access> findByUser(Long userId);

  List<Access> findByDevice(Long device);
}
