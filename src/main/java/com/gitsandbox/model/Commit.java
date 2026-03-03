package com.gitsandbox.model;

import java.util.UUID;

public class Commit {
    private String hash;
    private String message;
    private String parentHash;

    public Commit(String message, String parentHash){
        this.hash = UUID.randomUUID().toString().substring(0,7);
        this.message = message;
        this.parentHash = parentHash;
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
}
