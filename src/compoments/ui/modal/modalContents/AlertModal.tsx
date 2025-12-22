// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from 'react';
import stylesErrorMessage from './errorMessage.module.css'
const AlertModal = ({message= "Loading"}) => {
        return (
            <div className={stylesErrorMessage.container}>
                <p className="text text_type_main-large text_color_inactive">
                    {message}
                </p>
            </div>
        );
};


export default AlertModal;