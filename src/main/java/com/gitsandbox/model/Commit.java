package com.gitsandbox.model;

import java.util.UUID;

public class Commit {
    private String hash;
    private String message;
    private String parentHash;
    private String secondParentHash;

    public Commit(String message, String parentHash) {
        this(message, parentHash, null);
    }

    public Commit(String message, String parentHash, String secondParentHash) {
        this.hash = UUID.randomUUID().toString().substring(0, 7);
        this.message = message;
        this.parentHash = parentHash;
        this.secondParentHash = secondParentHash;
    }

    public String getHash() {
        return hash;
    }

    public String getMessage() {
        return message;
    }

    public String getParentHash() {
        return parentHash;
    }

    public String getSecondParentHash() {
        return secondParentHash;
    }
}
