package com.agroSoSProyect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AgroSoSControllerApplication {

	public static void main(String[] args) {
		SpringApplication.run(AgroSoSControllerApplication.class, args);
	}

}
