import React from "react";
import styles from "./ProfileStyle.module.css";
import { ProfileContainer } from "./Profile";

const ProfileOrders = () => {
    return (
        <ProfileContainer>
            <div className={styles.ordersPlaceholder}>

            </div>
        </ProfileContainer>
    );
};

export default ProfileOrders;
