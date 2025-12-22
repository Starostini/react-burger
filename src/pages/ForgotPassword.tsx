//@ts-expect-error React issue
import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./AuthPage.module.css";
import { request } from "../utils/request";
import { resetPasswordFlagKey } from "../constants/sessionStorageKeys";

interface PasswordResetResponse {
    success: boolean;
    message?: string;
}

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim()) {
            setError("Введите e-mail");
            return;
        }

        setError(null);
        setMessage(null);
        setIsSubmitting(true);

        try {
            const data = await request<PasswordResetResponse>("/password-reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            if (!data.success) {
                throw new Error(data.message || "Не удалось отправить письмо");
            }

            setMessage(data.message || "Письмо с инструкцией отправлено");
            sessionStorage.setItem(resetPasswordFlagKey, "true");
            navigate("/reset-password", { replace: true, state: { fromForgot: true } });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Произошла неизвестная ошибка";
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={`${styles.heading} text text_type_main-medium mb-6`}>Восстановление пароля</h2>

                {error && <p className={`${styles.error} text text_type_main-small`}>{error}</p>}
                {message && <p className={`${styles.message} text text_type_main-default`}>{message}</p>}
                {/*@ts-expect-error undefined property issue*/}
                <Input
                    type="email"
                    placeholder="Укажите e-mail"
                    value={email}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    extraClass="mb-6"
                />

                <Button htmlType="submit" type="primary" size="medium" disabled={isSubmitting}>
                    {isSubmitting ? "Подождите..." : "Восстановить"}
                </Button>

                <div className={`${styles.extraContainer} text text_type_main-default text_color_inactive mt-20`}>
                    <p>
                        Вспомнили пароль?{" "}
                        <Link to="/login" className={styles.link}>
                            Войти
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
