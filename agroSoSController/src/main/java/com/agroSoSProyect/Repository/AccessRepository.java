package com.agroSoSProyect.Repository;

import com.agroSoSProyect.Models.Access;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface AccessRepository extends JpaRepository<Access, Long> {
  List<Access> findByUser_Id(Long userId);

  List<Access> findByDevice_Id(Long deviceId);

  @Modifying
  @Transactional
  void deleteByDevice_Id(Long deviceId);
}
