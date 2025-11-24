import React, {Component, useState} from "react"
import AdminInput from "../../components/admin-input.jsx"
import AdminSelect from "../../components/admin-select.jsx"
import RoundTextArea from "../../components/roundTextArea"
import ScrollingFileList from "./scrollingFileList.jsx"
import AdminFrame from "../../components/admin-frame.jsx";

const block = {
    width: "calc(100% - 4px)",
    border: "1px solid #AAAFB2",
    marginBottom: "30px",
    height: "auto",
}

const formStyle = {
    display: "flex",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
}
const head = {
    width: "100%",
    height: "50px",
    borderBottom: "1px solid #AAAFB2",
    backgroundColor: "#ECF0F1",
    display: "flex",
    alignItems: "center",
}

const Items = () =>
{
    return (
        <div className="content-block invisible-scrolling">
            <NewItem/>
        </div>
    )
}


const NewItem = () => {
    const [name, setName] = useState("")
    const [category, setCategory] = useState(null)

    const secondLine = {
        height: "40px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        columnGap: "10px"
    }

    return (
        <AdminFrame title="Добавить товар" >
            <div className="blockContent">
                <div className="add-item-information">
                    <AdminInput height="40px" style={{ height: "40px", width: "100%"}} onChange={setName} placeholder="Название..."/>
                    <div style={secondLine}>
                        <AdminSelect style={{ flex: 2 }} placeholder="Раздел..."/>
                        <AdminInput type="number" placeholder="Цена..."  style={{width:'100px'}}/>
                        <AdminInput type="number" placeholder="Количество..." style={{width:'100px'}}/>
                    </div>
                    <RoundTextArea placeholder="Описание..." />
                </div>
                <ScrollingFileList onSelect={(file) => console.log(file)}/>
            </div>
            <div className="submit-place">
                <input type="button" value="Отправить" className="submit hover sendForm" />
            </div>
        </AdminFrame>
    );
}

// class NewItem extends Component {
//     constructor(props) {
//         super(props)
//
//         this.newItemName = React.createRef()
//         this.newItemSection = React.createRef()
//         this.newItemCategory = React.createRef()
//         this.newItemPrice = React.createRef()
//         this.newItemDescription = React.createRef()
//         this.newItemSelectPhoto = null
//
//         this.state = {
//             addItemButtonDisable: true,
//             types: [],
//         }
//     }
//
//     async ReloadTypes()
//     {
//         let formData = new FormData()
//         formData.append("sectionId", this.newItemSection.current.value)
//     }
//
//     NewItemFormCheck() {
//         this.setState({
//                 addItemButtonDisable: !(this.newItemName.current.value &&
//                     this.newItemSection.current.value !== "default" &&
//                     this.newItemCategory.current.value !== "default" &&
//                     this.newItemPrice.current.value &&
//                     this.newItemDescription.current.value &&
//                     this.newItemSelectPhoto),
//             })
//     }
//     OnPhotoSelectInNewItem(files) {
//         this.newItemSelectPhoto = files
//         this.NewItemFormCheck()
//     }
//
//     async SendNewItem() {
//         let formData = new FormData()
//
//         formData.append("name", this.newItemName.current.value)
//         formData.append("price", this.newItemPrice.current.value)
//         formData.append("sectionId", this.newItemSection.current.value)
//         formData.append("typeId", this.newItemCategory.current.value)
//         formData.append("info", this.newItemDescription.current.value)
//         Object.keys(this.newItemSelectPhoto).forEach((file) => {
//             formData.append("img", this.newItemSelectPhoto[file])
//         })
//
//     }
//
//     render() {
//         return (
//             <div style={block}>
//                 <div style={head}>
//                     <div style={{ color: "#2B3C4C" }}>Новый товар</div>
//                 </div>
//                 <div className="blockContent">
//                     <div className="addItemInformation">
//                         <AdminInput height="40px" style={{ height: "40px" }} ref={this.newItemName} onChange={() => {this.NewItemFormCheck()}} placeholder="Название..."/>
//                         <div style={{display: "flex", marginTop: "10px",}}>
//                             <AdminSelect style={{ flex: 2 }} onChange={() => {this.NewItemFormCheck()this.ReloadTypes()}} ref={this.newItemSection} placeholder="Раздел..." options={this.props.sections}/>
//                             <AdminInput type="number" style={{ flex: 1, height: "36px" }} ref={this.newItemPrice} onChange={() => {this.NewItemFormCheck()}} placeholder="Цена (руб)..."/>
//                         </div>
//                         <RoundTextArea placeholder="Описание..." onChange={() => {this.NewItemFormCheck()}} ref={this.newItemDescription} style={{ height: "250px" }}/>
//                     </div>
//                     <ScrollingFileList onSelect={(file) => this.OnPhotoSelectInNewItem(file)}/>
//                 </div>
//                 <div className="submitPlace">
//                     <input type="button" value="Отправить" className="submit hover sendForm" onClick={() => {this.SendNewItem()}} disabled={this.state.addItemButtonDisable}/>
//                 </div>
//             </div>
//         )
//     }
// }
//
// class SearchItem extends Component
// {
//     constructor(props)
//     {
//         super(props)
//
//         this.state = {
//             itemSearch: []
//         }
//     }
//
//     render()
//     {
//         return(
//             <div style={block}>
//                 <div style={head}>
//                     <div style={{ color: "#2B3C4C" }}>Найти товар</div>
//                 </div>
//                 <div
//                     style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         width: "95%",
//                         margin: "30px 0 30px 2.5%",
//                     }}
//                 >
//                     <ScrollingItemList
//                         items={this.state.itemSearch}
//                         onDelete={(item) => {
//                             console.log(item)
//                         }}
//                         onEdit={(item) => {
//                             console.log(item)
//                         }}
//                     />
//                 </div>
//             </div>
//         )
//     }
// }
//
// class EditItem extends Component
// {
//     constructor(props)
//     {
//         super(props)
//
//         this.state = {
//             sections: [],
//             types: []
//         }
//     }
//
//     render()
//     {
//         return(
//             <div style={block}>
//                 <div style={head}>
//                     <div style={{ color: "#2B3C4C" }}>Редактировать товар</div>
//                 </div>
//                 <div className="blockContent">
//                     <div className="addItemInformation">
//                         <AdminInput
//                             height="40px"
//                             style={{ height: "40px" }}
//                             placeholder="Название..."
//                         />
//                         <div
//                             style={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 marginTop: "10px",
//                             }}
//                         >
//                             <AdminSelect
//                                 style={{ minWidth: "120px", maxWidth: "210px" }}
//                                 placeholder="Раздел..."
//                                 options={this.state.sections}
//                             />
//                             <AdminSelect
//                                 style={{ minWidth: "120px", maxWidth: "210px" }}
//                                 placeholder="Категория..."
//                                 options={this.state.types}
//                             />
//                             <AdminInput
//                                 type="number"
//                                 style={{
//                                     minWidth: "90px",
//                                     maxWidth: "130px",
//                                     height: "36px",
//                                 }}
//                                 placeholder="Цена (руб)..."
//                             />
//                         </div>
//                         <RoundTextArea
//                             placeholder="Описание..."
//                             style={{ height: "250px" }}
//                         />
//                     </div>
//                     <ScrollingFileList />
//                 </div>
//                 <div className="submitPlace">
//                     <input
//                         type="button"
//                         value="Отправить"
//                         className="submit hover sendForm"
//                         onClick={() => {
//                             this.SendNewItem()
//                         }}
//                     />
//                 </div>
//             </div>
//         )
//     }
// }
//
// class ScrollingItemList extends Component
// {
//     constructor(props)
//     {
//         super(props);
//         this.input = React.createRef()
//     }
//     componentDidMount()
//     {
//         this.ReloadItems()
//     }
//
//     async ReloadItems()
//     {
//
//     }
//
//     async DeleteItem()
//     {
//
//         await this.ReloadItems()
//     }
//
//     main = {
//         width: "calc(100% - 4px)",
//         height: "400px",
//         border: "2px solid #AAAFB2",
//         borderRadius: "5px",
//         marginTop: "20px",
//         overflow: "hidden",
//         overflowY: "scroll",
//         paddingTop: "30px",
//         display: "flex",
//         flexWrap: "wrap",
//         justifyContent: "center"
//     }
//
//     render()
//     {
//         return(
//             <div>
//                 <div style={{display: "flex"}}>
//                     <AdminInput style={{height: "40px"}} ref={this.input} placeholder="Ключевое слово..."/>
//                     <input type="submit" className="search-button" onClick={()=>{this.ReloadItems()}} value="Найти" style={{marginLeft: "10px", height: "44px"}}/>
//                 </div>
//                 <div style={this.main} className="scrolling">
//                     {this.state?.items.map(item => {
//                         return <ItemListBlock item={item} delete={(item)=>{this.DeleteItem(item)}} edit={(item)=>{this.props.onEdit(item)}} key={item.id}/>})}
//                 </div>
//             </div>
//         )
//     }
// }
//
// const ItemListBlock = (props) => {
//
//     const DropIcon = (props) => {
//
//         const [isHovered, hover] = React.useState(false)
//
//         const enable = {
//             width: "120px",
//             height: "30px",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: "#FFFFFF88",
//             borderRadius: "8px",
//             marginRight: "10px",
//             transition: "0.1s",
//             cursor: "pointer",
//             fill: "#000000AA",
//             color: "#000000AA"
//         }
//
//         const disable = {
//             width: "30px",
//             height: "30px",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: "#FFFFFF88",
//             borderRadius: "8px",
//             marginRight: "10px",
//             transition: "0.1s",
//             fill: "#000000AA",
//             color: "#000000AA"
//         }
//
//         const tenable = {
//             width: "auto",
//             transition: "0.2s"
//         }
//         const tdisable = {
//             width: 0,
//             visibility: "hidden",
//             opacity: 0
//         }
//
//         return (
//             <div style={isHovered ? enable : disable} onMouseEnter={() => hover(true)} onMouseLeave={() => hover(false)} onClick={() => props.onClick()}>
//                 <p style={isHovered ? tenable : tdisable}>{props.text}</p>
//                 <ReactSVG src={props.link} className="svg20x20"/>
//             </div>
//         )
//     }
//
//     const [isMouseEnter, setMouseEnter] = React.useState(false)
//     const [isDeleting, setDeleteState] = React.useState(false)
//
//     const imageLink = import.meta.env.VITE_APP_API_URL + "/" + props.item.img.split(' ')[0]
//
//     const image = {
//         background: "url(" + imageLink + ") 100% 100% no-repeat",
//         backgroundRepeat: "no-repeat",
//         backgroundSize: "cover",
//         borderRadius: "10px",
//         overflow: "hidden",
//         marginLeft: "20px",
//         marginBottom: "30px"
//     }
//
//     const onHover = (value) => {
//         setMouseEnter(value)
//         if(!value)
//         {
//             setDeleteState(false)
//         }
//     }
//
//     const disable = {
//         opacity: 0,
//         width: "100%",
//         height: "100%",
//         visibility: "hidden",
//         position: "absolute",
//
//     }
//     const enable = {
//         opacity: 1,
//         transition: "0.2s",
//         width: "calc(100% + 4px)",
//         height: "calc(100% + 4px)",
//         background: "linear-gradient(#2D3E4E00, #2D3E4E)"
//     }
//     const deleting = {
//         opacity: 1,
//         transition: "0.2s",
//         width: "calc(100% + 4px)",
//         height: "calc(100% + 4px)",
//         position: "absolute",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         backdropFilter: "blur(3px)"
//     }
//     const delSuccessButton = {
//         width: "80px",
//         height: "35px",
//         borderRadius: "10px",
//         backgroundColor: "rgba(255, 255, 255, 0.4)",
//         backdropFilter: "blur(5px)",
//         border: 0,
//         margin: "20px 5px"
//     }
//     const infoBlock = {
//         display: "flex",
//         alignItems: "center"
//     }
//     const actionBlock = {
//         display: "flex",
//         width: "100%",
//         flexDirection: "row-reverse",
//         marginBottom: "20px"
//     }
//
//     return(
//         <div className="itemPreviewBlock" style={image}
//              onMouseEnter={() => onHover(true)}
//              onMouseLeave={() => {
//                  onHover(false)
//                  setDeleteState(false)
//              }}>
//             <div style={isMouseEnter ? enable : disable}>
//                 <div style={{display: "flex", width: "100%", height: "100%", flexDirection: "column-reverse"}}>
//                     <div style={{display: "flex", justifyContent: "space-around", fill: "#AAAFB2", color: "#AAAFB2", alignItems: "center", width: "100%", marginBottom: "10px"}}>
//                         <div style={infoBlock}>
//                         </div>
//                         <div style={infoBlock}>
//                         </div>
//                         <div style={infoBlock}>
//                         </div>
//                     </div>
//                     <div style={actionBlock}><DropIcon text="Удалить" onClick={() => setDeleteState(true)}/></div>
//                     <div style={actionBlock}><DropIcon text="Редактировать" onClick={()=>{props.edit(props.item)}}/></div>
//                     <div style={actionBlock}>
//                         <a href={import.meta.env.VITE_APP_API_URL + "/item/" + props.item.id} target="_blank" rel="noreferrer">
//                             <DropIcon onClick={() => {}} text="Открыть"/>
//                         </a>
//                     </div>
//                 </div>
//             </div>
//             <div style={isDeleting ? deleting : disable}>
//                 <div><h2 style={{color: "#FFF", textShadow: "#000 0 0 10px"}}>Удалить?</h2></div>
//                 <div>
//                     <button style={delSuccessButton}>Удалить</button>
//                     <button style={delSuccessButton} onClick={() => setDeleteState(false)}>Отмена</button>
//                 </div>
//
//             </div>
//         </div>
//     )
// }

export default Items
