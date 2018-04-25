package com.hellfreeze.demo;

import org.apache.tomcat.util.security.MD5Encoder;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@SpringBootApplication
public class HellFreezeApplication {

	public static void main(String[] args) {
		SpringApplication.run(HellFreezeApplication.class, args);
	}

}