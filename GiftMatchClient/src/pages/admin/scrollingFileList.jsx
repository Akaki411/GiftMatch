import React from 'react';
import PlusInCircleSVG from "../../resources/vector_icons/grey_plus_in_circle.svg";

const ScrollingFileList = (props) =>
{
    const [state, setState] = React.useState({})
    const selectImagesForCreateItem = React.createRef()

    const OnSelectImageForItem = async () =>
    {
        const files = selectImagesForCreateItem.current.files
        await setState(files)
        if(props.onSelect)
        {
            props.onSelect(files)
        }
    }

    return(
        <div className="addPhotoBlock">
            <label className="add-photo-button" style={props.btnStyle}>
                <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around"}}>
                    <p>Добавить фото</p>
                </div>
                <input type="file" accept="image/*" ref={selectImagesForCreateItem} multiple={true} onChange={() => {OnSelectImageForItem()}}/>
            </label>
            <div className="scrolling-file-list-block" style={props.blockStyle}>
                {Object.keys(state)?.map(file => {
                    return <Block file={state[file]} key={state[file].name}/>
                })}
            </div>
        </div>
    )
}

const Block = ({file}) =>
{
    const block = {
        width: "100px",
        height: "120px",
        position: "relative",
        border: "2px solid #AAAFB2",
        margin: "20px 0 10px 20px ",
        borderRadius: "20px",
        cursor: "pointer",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
    const text = {
        width: "100px",
        height: "10px",
        color: "#AAAFB2",
        textAlign: "center",
        overflow: "hidden",
        position: "absolute",
        marginLeft: "20px"
    }
    const deleteBlock = {
        width: "100px",
        height: "120px",
        position: "absolute",
        backgroundColor: "#C7C7C7",
        opacity: "0",
        borderRadius: "18px",
        top: "0",
        zIndex: "2"
    }
    const image = {
        height: "100%",
        display: "block"
    }
    return(
        <div style={{position: "relative"}}>
            <div style={block} className="imageBlock">
                <img src={URL.createObjectURL(file)} alt="changedImage" style={image}/>
                <div style={deleteBlock} className="deleteImageBlock">
                    <span className="cross"/>
                </div>
            </div>
            <div style={text}>
                <p style={{fontSize: "9px"}}>{file.name} 123</p>
            </div>
        </div>

    )
}

export default ScrollingFileList;