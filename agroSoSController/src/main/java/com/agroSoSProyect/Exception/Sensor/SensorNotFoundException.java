package com.agroSoSProyect.Exception.Sensor;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.agroSoSProyect.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.agroSoSProyect.Models.User;

public class SensorNotFoundException extends RuntimeException {
  public SensorNotFoundException(Long id) { super("Could not found the user with id "+ id); }
}