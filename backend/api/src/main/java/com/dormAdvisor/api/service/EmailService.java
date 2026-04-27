package com.dormAdvisor.api.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendMagicLink(String to, String link) {
        log.info("Sending magic link email to: {}", to);
        final var message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your Dorm Advisor sign-in link");
        message.setText("Click the link below to sign in. It expires in 15 minutes.\n\n" + link);
        mailSender.send(message);
        log.info("Magic link email sent to: {}", to);
    }
}