package com.gitsandboxtest.service;

import com.gitsandbox.service.GitService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class GitServiceTest {
    private GitService gitService;

    @BeforeEach
    void setUp() {
        gitService = new GitService();
    }

    @Test
    void testGitInit() {
        String response = gitService.processCommand("git init");
        assertEquals("Initialized empty Git Repository", response);
    }

    @Test
    void testCommandBeforeInit() {
        String response = gitService.processCommand("git status");
        assertTrue(response.contains("fatal: not a git repository"));
    }

    @Test
    void testGitCommit() {
        gitService.processCommand("git init");
        gitService.processCommand("touch file.txt");
        gitService.processCommand("git add .");
        String response = gitService.processCommand("git commit -m \"first commit\"");

        assertTrue(response.contains("first commit"));
        assertTrue(response.contains("[main"));
    }

    @Test
    void testBranchCreationAndCheckout() {
        gitService.processCommand("git init");
        gitService.processCommand("touch file.txt");
        gitService.processCommand("git add .");
        gitService.processCommand("git commit -m \"first commit\"");

        String branchResponse = gitService.processCommand("git checkout -b feature-login");
        assertEquals("Switched to a new branch 'feature-login'", branchResponse);

        String statusResponse = gitService.processCommand("git status");
        assertTrue(statusResponse.contains("On branch feature-login"));
    }

    @Test
    void testGitLog() {
        gitService.processCommand("git init");
        gitService.processCommand("touch file.txt");
        gitService.processCommand("git add .");
        gitService.processCommand("git commit -m \"first commit\"");

        String response = gitService.processCommand("git log");
        assertTrue(response.contains("first commit"));
        assertTrue(response.contains("commit"));
    }
}