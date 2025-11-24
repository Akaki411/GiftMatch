import React, {Component} from 'react';

class RoundToggle extends Component
{
    constructor(props)
    {
        super(props)

        this.activeColor = this.props.activeColor || "#16BB99"
        this.disableColor = this.props.disableColor || "#FF6C6C"
        this.componentWidth = this.props.width || "40px"
        this.componentHeight = this.props.height || "20px"
        this.callback = this.props.callback

        this.state = {
            isActive: false
        }
    }

    Click(state)
    {
        if (this.callback)
        {
            this.callback(state)
        }
        this.setState({isActive: state})
    }

    render()
    {
        return (
            <div style={{
                position: "relative",
                width: this.componentWidth,
                height: this.componentHeight,
                backgroundColor: this.state["isActive"] ? this.activeColor : this.disableColor,
                border: "1px solid #AAAFB2",
                borderRadius: "10px",
                cursor: "pointer"
            }} onClick={() => {this.Click(!this.state.isActive)}}>
                <div style={{
                    position: "absolute",
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#ECF0F1",
                    border: "1px solid #AAAFB2",
                    borderRadius: "20px",
                    top: "-1px",
                    transition: "0.2s",
                    left: this.state.isActive ? "20px" : "-1px"
                }}/>
            </div>
        )
    }
}

export default RoundToggle;