package com.dormAdvisor.api.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendMagicLink(String to, String link) {
        log.info("Sending magic link email to: {}", to);
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Sign in to DormAdvisor");
            helper.setFrom("noreply@dormadvisor.app", "DormAdvisor");
            helper.setText(buildPlainText(link), buildHtml(link));
            mailSender.send(mime);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to send magic link email", e);
        }
        log.info("Magic link email sent to: {}", to);
    }

    private String buildPlainText(String link) {
        return """
            Sign in to DormAdvisor
            ──────────────────────
            Click the link below to sign in to your account.
            This link expires in 15 minutes and can only be used once.

            %s

            If you didn't request this, you can safely ignore this email.

            — The DormAdvisor Team
            """.formatted(link);
    }

    private String buildHtml(String link) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body style="margin:0;padding:0;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
                <tr>
                  <td align="center">
                    <table width="540" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

                      <!-- Header -->
                      <tr>
                        <td style="background:#1d4ed8;padding:32px 40px;">
                          <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                            Dorm<span style="color:#93c5fd;">Advisor</span>
                          </p>
                        </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                        <td style="padding:40px 40px 32px;">
                          <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">
                            Your sign-in link
                          </h1>
                          <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
                            Click the button below to sign in to your DormAdvisor account.
                            This link expires in <strong style="color:#111827;">15 minutes</strong> and can only be used once.
                          </p>

                          <!-- CTA button -->
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="border-radius:8px;background:#1d4ed8;">
                                <a href="%s"
                                   style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                                  Sign in to DormAdvisor
                                </a>
                              </td>
                            </tr>
                          </table>

                          <p style="margin:28px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;">
                            Or copy and paste this link into your browser:<br/>
                            <span style="color:#1d4ed8;word-break:break-all;">%s</span>
                          </p>
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr>
                        <td style="padding:0 40px;">
                          <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding:24px 40px 32px;">
                          <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                            If you didn't request this email, you can safely ignore it — someone may have entered your address by mistake.
                            Your account will not be affected.
                          </p>
                          <p style="margin:12px 0 0;font-size:12px;color:#d1d5db;">
                            &copy; 2025 DormAdvisor &mdash; helping students find the best place to live.
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(link, link);
    }
}