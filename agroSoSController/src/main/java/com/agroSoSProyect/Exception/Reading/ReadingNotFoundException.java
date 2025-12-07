package com.agroSoSProyect.Exception.Reading;

public class ReadingNotFoundException extends RuntimeException {
  public ReadingNotFoundException(Long id) {
    super("Could not find reading with id " + id);
  }
}
