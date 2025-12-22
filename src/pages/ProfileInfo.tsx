//@ts-expect-error React issue
import React, { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../services/hooks.ts";
import {Button, EditIcon, Input,  ShowIcon, HideIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./ProfileStyle.module.css";
import { currentUser, userLoading } from "../services/selectors";
import { clearUserError } from "../services/userSlice";
import { updateUser } from "../services/userActions";
import { ProfileContainer } from "./Profile";

interface ProfileFormState {
    name: string;
    email: string;
    password: string;
}

const ProfileInfo = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(currentUser);
    const isGlobalLoading = useAppSelector(userLoading);
    const [isNameEditable, setIsNameEditable] = useState(true);
    const [isEmailEditable, setIsEmailEditable] = useState(true);
    const [isPasswordEditable, setIsPasswordEditable] = useState(true);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [passwordType, setPasswordType] = useState<"password" | "text">("password");
    const handlePasswordInput = () => {
        if(isPasswordEditable){
            setIsPasswordEditable(false)
        } else {
            setIsPasswordVisible(!isPasswordVisible)
            if(isPasswordVisible){
                setPasswordType("password")
            } else {
                setPasswordType("text")
            }
        }

    }
    const [form, setForm] = useState<ProfileFormState>({
        name: user?.name ?? "",
        email: user?.email ?? "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setForm({
            name: user?.name ?? "",
            email: user?.email ?? "",
            password: "",
        });
    }, [user?.name, user?.email]);

    useEffect(() => {
        dispatch(clearUserError());
    }, [dispatch]);

    const origin = useMemo(
        () => ({
            name: user?.name ?? "",
            email: user?.email ?? "",
        }),
        [user?.name, user?.email]
    );

    const isDirty = useMemo(() => {
        return (
            form.name.trim() !== origin.name.trim() ||
            form.email.trim() !== origin.email.trim() ||
            form.password.trim().length > 0
        );
    }, [form, origin]);

    const handleChange = (field: keyof ProfileFormState) => (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isDirty) {
            return;
        }
        setIsSubmitting(true);

        const payload: { name?: string; email?: string; password?: string } = {};
        if (form.name.trim() !== origin.name.trim()) {
            payload.name = form.name.trim();
        }
        if (form.email.trim() !== origin.email.trim()) {
            payload.email = form.email.trim();
        }
        if (form.password.trim()) {
            payload.password = form.password.trim();
        }

        dispatch(updateUser(payload))
            .unwrap()
            .then(() => {
                setForm((prev) => ({ ...prev, password: "" }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleCancel = () => {
        setForm({ name: origin.name, email: origin.email, password: "" });
    };

    const isBusy = isSubmitting || isGlobalLoading;

    return (
        <ProfileContainer>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputCover}>
                 {/*//@ts-expect-error undefined property issue*/}
                <Input
                    type="text"
                    placeholder="Имя"
                    value={form.name}
                    onChange={handleChange("name")}
                    extraClass={`mb-6`}
                    disabled={isNameEditable}
                    onBlur={() => setIsNameEditable(true)}
                />
                    <div className={styles.icon} onClick={() => setIsNameEditable(!isNameEditable)}>
                    <EditIcon type={"primary"} />
                    </div>
                </div>
                <div className={styles.inputCover}>
                    {/*//@ts-expect-error undefined property issue*/}
                <Input
                    type="email"
                    placeholder="Логин"
                    value={form.email}
                    onChange={handleChange("email")}
                    extraClass="mb-6 text_color_inactive"
                    disabled={isEmailEditable}
                    onBlur={() => setIsEmailEditable(true)}
                />
                    <div className={styles.icon} onClick={() => setIsEmailEditable(!isEmailEditable)}>
                        <EditIcon type={"primary"} />
                    </div>
                </div>
                <div className={styles.inputCover}>
                    {/*//@ts-expect-error undefined property issue*/}
                <Input
                    type={passwordType}
                    placeholder="Пароль"
                    value={form.password}
                    onChange={handleChange("password")}
                    extraClass="mb-6"
                    disabled={isPasswordEditable}
                    onBlur={() => setIsPasswordEditable(true)}

                />
                    <div className={styles.icon} onClick={() => handlePasswordInput()}>
                        {isPasswordEditable ? <EditIcon type={"primary"}/> : !isPasswordVisible ? <HideIcon type={"primary"}/> : <ShowIcon type={"primary"}/>}
                    </div>
                </div>
                {isDirty && (
                    <div className={styles.buttons}>
                        <Button htmlType="button" type="secondary" size="medium" onClick={handleCancel} disabled={isBusy}>
                            Отмена
                        </Button>
                        <Button htmlType="submit" type="primary" size="medium" disabled={isBusy}>
                            {isBusy ? "Подождите..." : "Сохранить"}
                        </Button>
                    </div>
                )}
            </form>
        </ProfileContainer>
    );
};

export default ProfileInfo;
