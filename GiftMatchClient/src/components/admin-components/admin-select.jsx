import React from 'react';

const AdminSelect = ({
    options = [],
    name = "name",
    onChange = () => {},
    style = {},
    placeholder = ""
}) => {
    const current = (ref) => {
        let obj = null
        options.forEach(option => {
            if (option.id.toString() === ref.target.value)
            {
                obj = option.id
            }
        })
        onChange(obj)
    }

    return (
        <select name={name} onChange={current} className="round-select" defaultValue="default" style={style}>
            <option value="default" className="round-select-option" disabled={true}>{placeholder}</option>
            {options.map(option => {
                return <Option data={option} key={option.id}/>
            })}
        </select>
    )
}

const Option = (props) => {
    return(
        <option value={props.data.id} className="round-select-option">{props.data.name}</option>
    )
}

export default AdminSelect;