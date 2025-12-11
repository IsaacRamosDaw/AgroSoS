package com.agroSoSProyect.Exception.User;

// Excepción que se lanza cuando no se encuentra un usuario
// Es básicamente un objeto interno de Java, que UserNotFoundAdvice intercepta y lo lanza al frontend
public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(Long id){ super("Could not find the user with id "+ id); }
}