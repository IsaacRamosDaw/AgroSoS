package com.agroSoSProyect.Exception.Plant;

public class PlantNotFoundException extends RuntimeException {
  public PlantNotFoundException(Long id) {
    super("Could not find plant with id " + id);
  }
}
