package com.algone.reservations.exception.auth;

public class EmailAlreadyExistsException extends AuthException {
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
