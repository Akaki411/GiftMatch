import React from 'react'
import {ChevronRight} from "lucide-react"

const block = {
    width: '100%',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
}
const text = {
    fontSize: '18px',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
}
const arrow = {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
}
const ArrowTitle = ({
    title = "Название",
    link = "#"
}) => {
    return (
        <div style={block}>
            <div style={text}>{title}</div>
            <div style={arrow}>
                <ChevronRight />
            </div>
        </div>
    );
};

export default ArrowTitle;