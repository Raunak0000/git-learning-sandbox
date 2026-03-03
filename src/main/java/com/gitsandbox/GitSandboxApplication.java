package com.gitsandbox;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GitSandboxApplication {
    public static void main(String[] args) {
        SpringApplication.run(GitSandboxApplication.class,args);
        System.out.println("Git learning sandbox is running! ");
    }
}
