package com.entrecopas;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EntrecopasApplication {

	public static void main(String[] args) {
		SpringApplication.run(EntrecopasApplication.class, args);
	}

	@Bean
CommandLineRunner test() {
    return args -> System.out.println("SPRING DETECTA TODO");
}

}
