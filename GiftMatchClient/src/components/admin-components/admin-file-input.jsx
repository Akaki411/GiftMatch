import React, {useEffect} from 'react';
import {CirclePlus} from "lucide-react";

const plusPlace = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly"
}
const image = {
    width: "100%",
    height: "100%",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
}

const AdminFileInput = ({
    width = "100%",
    height = "100%",
    style = {},
    onSelect = () => {}
}) => {
    const [file, setFile] = React.useState(null)

    useEffect(() => {onSelect(file)}, [file])

    return (
        <label className="add-photo-button" style={{width: width, height: height, ...style}}>
            {file ? <div style={{background: `url(${URL.createObjectURL(file)})`, ...image}}/> : <div style={plusPlace}>
                <CirclePlus size={80} color="#aaafb2" strokeWidth={1}/>
                <p>Добавить фото</p>
            </div>}
            <input type="file" accept="image/*" multiple={true} onChange={(key) => {setFile(key.target.files[0])}}/>
        </label>
    );
};

export default AdminFileInput;