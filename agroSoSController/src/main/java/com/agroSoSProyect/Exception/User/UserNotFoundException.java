package com.agroSoSProyect.Exception.User;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.agroSoSProyect.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.agroSoSProyect.Models.User;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(Long id){
        super("Could not found the user with id "+ id);
    }
}