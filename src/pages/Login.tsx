import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Input, PasswordInput, Button } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./AuthPage.module.css";
import { loginUser } from "../services/userActions";
import { clearUserError } from "../services/userSlice";
import { userError, userLoading } from "../services/selectors";
import type { AppDispatch } from "../services/store";

const Login = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const authError = useSelector(userError);

    const isLoading = useSelector(userLoading);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        dispatch(clearUserError());
        if (!email.trim() || !password.trim()) {
            setValidationError("Заполните E-mail и пароль");
            return;
        }
        setValidationError(null);


        dispatch(loginUser({ email: email.trim(), password }))
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
                <h2 className={`text text_type_main-medium mb-6`}>Вход</h2>
                {validationError && <p className={`${styles.error} text text_type_main-small`}>{validationError}</p>}
                {authError && <p className={`${styles.error} text text_type_main-small`}>{authError}</p>}

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
                    {isLoading ? "Подождите..." : "Войти"}
                </Button>

                <div className={`${styles.extraContainer} text text_type_main-default text_color_inactive mt-20`}>
                    <p>
                        Вы — новый пользователь?{" "}
                        <Link to="/register" className={styles.link}>
                            Зарегистрироваться
                        </Link>
                    </p>
                    <p>
                        Забыли пароль?{" "}
                        <Link to="/forgot-password" className={styles.link}>
                            Восстановить пароль
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
