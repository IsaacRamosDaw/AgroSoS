package com.agroSoSProyect.Repository;

import com.agroSoSProyect.Models.Plant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlantRepository extends JpaRepository<Plant, Long> {
  List<Plant> findByName(String name);
}
