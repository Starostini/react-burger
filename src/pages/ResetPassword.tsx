import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input, PasswordInput, Button } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./AuthPage.module.css";
import { request } from "../utils/request";
import { resetPasswordFlagKey } from "../constants/sessionStorageKeys";

interface ResetPasswordResponse {
    success: boolean;
    message?: string;
}

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fromForgot = Boolean((location.state as { fromForgot?: boolean } | undefined)?.fromForgot);
        const allowed = sessionStorage.getItem(resetPasswordFlagKey);

        if (!fromForgot && !allowed) {
            navigate("/forgot-password", { replace: true });
        }

        return () => {
            sessionStorage.removeItem(resetPasswordFlagKey);
        };
    }, [location.state, navigate]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!password.trim() || !token.trim()) {
            setError("Введите новый пароль и код из письма");
            return;
        }

        setError(null);
        setMessage(null);
        setIsSubmitting(true);

        try {
            const data = await request<ResetPasswordResponse>("/password-reset/reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password, token }),
            });

            if (!data.success) {
                throw new Error(data.message || "Не удалось сбросить пароль");
            }

            setMessage(data.message || "Пароль успешно обновлён");
            sessionStorage.removeItem(resetPasswordFlagKey);
            navigate("/login", { replace: true });
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
                {message && <p className={`${styles.message} text text_type_main-default mb-4`}>{message}</p>}

                <PasswordInput
                    placeholder="Введите новый пароль"
                    value={password}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    extraClass="mb-6"
                />

                <Input
                    type="text"
                    placeholder="Введите код из письма"
                    value={token}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setToken(event.target.value)}
                    extraClass="mb-6"
                />

                <Button htmlType="submit" type="primary" size="medium" disabled={isSubmitting}>
                    {isSubmitting ? "Подождите..." : "Сохранить"}
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

export default ResetPassword;
