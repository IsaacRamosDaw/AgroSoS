package com.agroSoSProyect.Exception.User;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Map;

// Clase que se encarga de interceptar la excepción UserNotFoundException

// @ControllerAdvice es un componente que se encarga de interceptar las excepciones
@ControllerAdvice
public class UserNotFoundAdvice {

    // @ResponseBody se encarga de envíar un json al cliente
    @ResponseBody
    // @ExceptionHandler es el método que se encarga de la excepción UserNotFoundException
    @ExceptionHandler(UserNotFoundException.class)
    // @ResponseStatus es el código de estado que se devuelve al cliente
    // En este caso, 404 Not Found
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> exceptionHandler(UserNotFoundException exception) {

        return Map.of("errorMessage", exception.getMessage());

    }
}