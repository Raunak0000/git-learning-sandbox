package com.gitsandbox.controller;

import com.gitsandbox.service.GitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/terminal")
@CrossOrigin(origins = "*") // to talk to frontend
public class TerminalController {
    @Autowired
    private GitService gitService;

    @PostMapping("/execute")
    public String execute(@RequestBody Map<String, String> payload) {
        String command = payload.get("command");
        if (command == null || command.isEmpty()) {
            return "";
        }
        return gitService.processCommand(command);
    }

    @PostMapping("/reset")
    public String reset() {
        gitService.reset();
        return "Sandbox reset";
    }
}
