import React from 'react';
import NavBar from "../../components/client-components/nav-bar.jsx";
import SearchBar from "./search-bar.jsx"

const Home = () => {

    return (
        <div className="client-wrapper">
            <div className="client-content">
                <SearchBar />
            </div>
            <NavBar/>
        </div>
    );
};

export default Home;