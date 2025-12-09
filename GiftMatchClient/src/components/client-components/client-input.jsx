import React, {useEffect} from 'react';

const ClientInput = ({
    onChange = () => {},
    placeholder = 'Введите текст',
    type = 'text',
    value = '',
}) => {
    const [active, setActive] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const [text, setText] = React.useState(value);

    useEffect(() => {
        setActive(focused || text !== "" || value !== "");
        onChange(text);
    }, [text, focused]);

    return (
        <label className="client-input">
            <input type={type} value={text} onChange={key => {setText(key.target.value)}} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}/>
            <div className={active ? 'client-input_placeholder client-input_placeholder-active' : "client-input_placeholder"}>{placeholder}</div>

        </label>
    );
};

export default ClientInput;