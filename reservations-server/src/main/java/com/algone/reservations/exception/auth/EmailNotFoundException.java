package com.algone.reservations.exception.auth;

public class EmailNotFoundException extends AuthException {
    public EmailNotFoundException(String message) {
        super(message);
    }
}
