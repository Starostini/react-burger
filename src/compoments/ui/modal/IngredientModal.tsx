import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../services/hooks.ts";
import Modal from "./Modal.tsx";
import { Ingredient } from "./modalContents/IngredientContent.tsx";
import { clearCurrent } from "../../../services/currentIngredientSlice.ts";
import { ingredientModalState, ingredientModalBackgroundState } from "../../../constants/sessionStorageKeys.ts";

const IngredientModal = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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
