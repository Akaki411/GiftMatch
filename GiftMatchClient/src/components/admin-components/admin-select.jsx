import React from 'react';

const AdminSelect = ({
    options = [],
    name = "name",
    onChange = () => {},
    style = {},
    placeholder = ""
}) => {
    const ref = React.createRef();
    const currentOption = () => {
        let obj = null
        options.forEach(option => {
            if (option.id.toString() === ref.current.value)
            {
                obj = option
            }
        })
        return obj
    }

    return (
        <select name={name} ref={ref} onChange={()=> {onChange(currentOption())}} className="round-select" defaultValue="default" style={style}>
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