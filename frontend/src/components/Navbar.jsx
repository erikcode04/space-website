import React, { useState, useContext } from 'react';
import { CiSearch } from "react-icons/ci";
import { FaBars } from "react-icons/fa"; 
import axios from 'axios';
import { AuthContext } from '../agils/checkAuth';
import { profilePictures} from "../services/getProfilePictures";


import "./componentStyles/navbar.css";
import {handleLogout} from "../agils/logOut";
function Navbar() {
    const { userInfo } = useContext(AuthContext);
    const [searchValue, setSearchValue] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };


    async function calllogOut() {
        const response = await handleLogout();
        if (response.ok) {
            console.log('Logged out successfully');
        } else {
            console.error('Failed to log out');
            return response;
        }
    }

    async function recomendedSearches(event) {
        setSearchValue(event.target.value);
        console.log(searchValue);
        console.log('authCOntext', userInfo);
        try {
            const response = await axios.post(`http://localhost:5000/users/recomendedSearches?search=${event.target.value}`, userInfo); 
            if (response) {
                console.log('response inside recomendedSearches controller', response);
                setSuggestions(response.data);
                if (event.target.value.length === 0) {
                    console.log('no search value');
                    setSuggestions([]);
                    setIsSuggestionsVisible(false);
                    return response;
                }
                setIsSuggestionsVisible(true);
                return response;
            } else {
                setSuggestions([]);
                setIsSuggestionsVisible(false);
                return response;
            }
        }
        catch (error) {
            console.error('Failed to fetch data');
            setSuggestions([]);
            setIsSuggestionsVisible(false);
            return error;
        }
    }

    return (
        <nav id='nav-container'>
            <div id='nav-logoContainer'>
                <a id='nav-homeLink' href='/'> 
                    <h1 id='nav-homeLinkText'> Home </h1>
                </a>
            </div>
            <div id='nav-hamburger' onClick={toggleMobileMenu}>
                <FaBars />
            </div>
            <ul id='nav-list' className={isMobileMenuOpen ? 'active' : ''}>
                <li className='nav-listItem'>
                    <a className='nav-listLink' href="/" >About </a>
                </li>
                <li className='nav-listItem'>
                    <a className='nav-listLink' href="/about" >Contact </a>
                </li>
                <li className='nav-listItem'>
                    <a className='nav-listLink' href="/profilePage" >Profile </a>
                </li>
                <form id='nav-searchForm'>
                    <input id='nav-searchInput' onChange={recomendedSearches} value={searchValue} type="text" placeholder="Search.." name="search" />
                    <button id='nav-searchButton' type="submit"><CiSearch /></button>
                    {isSuggestionsVisible && (
            <div id='search-suggestions' className='dropdown-content show'>
            {suggestions.map((user, index) => (
                <a key={index} href={`/user/${user.id}`}>  
                 <img src={profilePictures.find(picture => picture.name === user.profilePicture)?.src} alt={`${user.userName}'s profile`} className='profile-picture' />
                  {user.userName}
                  </a>
            ))}
        </div>
        )}
                </form>
                <div id='nav-rightSideWrapper'> 
                    <li className='nav-listItem dropdown'>
                        <a href="#" className='dropbtn'>Categories</a>
                        <div className='dropdown-content'>
                            <a href="/stocks">Stocks</a>
                            <a href="/post">Post</a>
                            <button id='nav-LogOutButton' onClick={calllogOut}>Log Out</button>
                        </div>
                    </li>
                    <div id='nav-Logo'>
                    </div>
                </div>
            </ul>
        </nav>
    );
}

export default Navbar;