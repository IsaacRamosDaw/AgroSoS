package com.agroSoSProyect.Repository;

import com.agroSoSProyect.Models.Device;
import com.agroSoSProyect.Models.DeviceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
  List<Device> findByUser(Long userId);

  List<Device> findByName(String name);

  List<Device> findByType(DeviceType type);
}
