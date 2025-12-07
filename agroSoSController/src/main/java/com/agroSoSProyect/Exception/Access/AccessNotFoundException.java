package com.agroSoSProyect.Exception.Access;

public class AccessNotFoundException extends RuntimeException {
  public AccessNotFoundException(Long id) {
    super("Could not find access with id " + id);
  }
}
