import React from 'react';
import Ident from "../../components/client-components/ident.jsx";
import TextBlock from "../../components/client-components/text-block.jsx";
import BlackButton from "../../components/client-components/black-button.jsx";

const UnAuth = ({
    onClick = () => {}
}) => {
    return (
        <div className="client-wrapper">
            <div className="client-content">
                <Ident size="40%"/>
                <TextBlock>Для доступа к этой странице нужно войти в аккаунт</TextBlock>
                <Ident size={20}/>
                <BlackButton text="Войти" onClick={onClick} />
            </div>

        </div>
    );
};

export default UnAuth;