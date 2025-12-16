//@ts-expect-error React issue
import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../services/hooks.ts";
import { Input, PasswordInput, Button } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./AuthPage.module.css";
import { registerUser } from "../services/userActions";
import { clearUserError } from "../services/userSlice";
import { userError, userLoading } from "../services/selectors";

const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const authError = useAppSelector(userError);
    const isLoading = useAppSelector(userLoading);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(clearUserError());
        if (!name.trim() || !email.trim() || !password.trim()) {
            setValidationError("Пожалуйста, заполните все поля");
            return;
        }

        setValidationError(null);

        dispatch(registerUser({ name: name.trim(), email: email.trim(), password }))
            .unwrap()
            .then(() => {
                const from = (location.state as { from?: Location } | undefined)?.from;
                const redirectTo = from?.pathname ?? "/";
                navigate(redirectTo, { replace: true });
            })
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={`${styles.heading} text text_type_main-medium mb-6`}>Регистрация</h2>

                {validationError && <p className={`${styles.error} text text_type_main-small mb-6`}>{validationError}</p>}
                {authError && <p className={`${styles.error} text text_type_main-small mb-6`}>{authError}</p>}
                {/*//@ts-expect-error undefined property issue*/}
                <Input
                    type="text"
                    placeholder="Имя"
                    value={name}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                    extraClass="mb-6"
                />
                {/*//@ts-expect-error undefined property issue*/}
                <Input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    extraClass="mb-6"
                />

                <PasswordInput
                    placeholder="Пароль"
                    value={password}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    extraClass="mb-6"
                />

                <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
                    {isLoading ? "Подождите..." : "Зарегистрироваться"}
                </Button>

                <div className={`${styles.extraContainer} text text_type_main-default text_color_inactive mt-20`}>
                    <p>
                        Уже зарегистрированы?{" "}
                        <Link to="/login" className={styles.link}>
                            Войти
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Register;
