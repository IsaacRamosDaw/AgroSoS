package com.agroSoSProyect.Repository;

import com.agroSoSProyect.Models.Plant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PlantRepository extends JpaRepository<Plant, Long> {
  List<Plant> findByName(String name);

  List<Plant> findByDeviceId(Long deviceId);

  @Modifying
  @Transactional
  void deleteByDeviceId(Long deviceId);
}
