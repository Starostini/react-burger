import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Modal from "./Modal.tsx";
import { Ingredient } from "./modalContents/IngredientContent.tsx";
import { clearCurrent } from "../../../services/currentIngredientSlice.ts";
import type { AppDispatch } from "../../../services/store.ts";
import { ingredientModalState, ingredientModalBackgroundState } from "../../../constants/sessionStorageKeys.ts";

const IngredientModal = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleClose = useCallback(() => {
        dispatch(clearCurrent());
        sessionStorage.removeItem(ingredientModalState);
        sessionStorage.removeItem(ingredientModalBackgroundState);
        navigate(-1);
    }, [dispatch, navigate]);

    useEffect(() => () => {
        dispatch(clearCurrent());
        sessionStorage.removeItem(ingredientModalState);
        sessionStorage.removeItem(ingredientModalBackgroundState);
    }, [dispatch]);

    return (
        <Modal onClose={handleClose}>
            <Ingredient />
        </Modal>
    );
};

export default IngredientModal;
