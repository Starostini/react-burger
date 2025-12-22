//@ts-expect-error React issue
import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "./Modal";
import OrderInfoContainer from "../../orders/OrderInfoContainer";
import { useAppDispatch } from "../../../services/hooks";
import { clearOrderDetails } from "../../../services/orderDetailsSlice";

const OrderModal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleClose = useCallback(() => {
        dispatch(clearOrderDetails());
        navigate(-1);
    }, [dispatch, navigate]);

    return (
        <Modal onClose={handleClose}>
            <OrderInfoContainer orderNumber={id} variant="modal" />
        </Modal>
    );
};

export default OrderModal;
