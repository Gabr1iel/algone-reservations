package com.algone.reservations.service;

import com.algone.reservations.entity.User;
import com.algone.reservations.exception.BusinessException;
import com.algone.reservations.exception.ConflictException;
import com.algone.reservations.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<User> getAll() {
        return userRepository.findAllOrderedByCreatedAtDesc();
    }

    @Transactional
    public void delete(Long id, Authentication authentication) {
        String currentEmail = authentication.getName();
        User self = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new BusinessException("Aktuální uživatel nebyl nalezen."));

        if (self.getId().equals(id)) {
            throw new BusinessException("Nelze smazat vlastní účet.");
        }

        User target = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Uživatel nebyl nalezen: " + id));

        try {
            userRepository.delete(target);
            userRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException(
                    "Uživatele nelze smazat — má vázané rezervace. Nejprve je zrušte nebo smažte."
            );
        }
    }
}
