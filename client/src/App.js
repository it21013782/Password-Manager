import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import passwordManagerImage from './images/password-manager-sm-img.png';
import websiteImage from './images/password-manager-website-img.png';
import usernameImage from './images/password-manager-username-img.png';
import passwordImage from './images/password-manager-password-img.png';
import largeImage from './images/password-manager-lg-img.png';
import searchImage from './images/password-manager-search-img.png';
import deleteImage from './images/password-manager-delete-img.png';

function App() {

  const [passwords, setPasswords] = useState("");
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [passwordList, setPasswordList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8010/showpasswords').then((response) => {
      setPasswordList(response.data);
    });
  }, []);
  
  const resetForm = () => {
    setPasswords('');
    setWebsite('');
    setUsername('');
  };

  const addPassword = () => {
    axios
      .post('http://localhost:8010/addpassword', {
        password: passwords,
        website: website,
        username: username,
      })
      .then(() => {
        console.log('success');
        resetForm(); // Clear the form inputs
        // Fetch the updated password list
        axios.get('http://localhost:8010/showpasswords').then((response) => {
          setPasswordList(response.data);
        });
      });
  };
  
  const decryptPassword = (encryption) => {
    axios.post('http://localhost:8010/decryptpassword', {
      password: encryption.password,
      iv: encryption.iv
    }).then((response) => {
      setPasswordList(
        passwordList.map((val) => {
          return val.id === encryption.id ? {id: val.id, password: val.password, website: response.data, iv: val.iv} : val
        }
        )
      );
    }
    );
  };

  const deletePassword = (id) => {
    axios.delete(`http://localhost:8010/deletepassword/${id}`).then(() => {
      setPasswordList(passwordList.filter((val) => val.id !== id));
      console.log('success');
    });
  };
  
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="App">
      <div className="appTitle">
        <h1>Secure Password Manager</h1>
      </div>
      <div className='sub-div1'>
        <img
            src={passwordManagerImage}
            className="sub-div1-image2"
            alt="password manager"
        />
        <form className='add-details'>
        <h1 className="detail-heading">Add New Password</h1>
        <div className="input-holder">
            <img
              src={websiteImage}
              className="input-image"
              alt="website"
            />
            <input type='text' className="input-element" placeholder='Enter Website' onChange={
                (event) => {
                  setWebsite(event.target.value);
                }
            }/>
        </div>

        <div className="input-holder">
            <img
              src={usernameImage}
              className="input-image"
              alt="username"
            />
            <input type='text' className="input-element" placeholder='Enter Username' onChange={
              (event) => {
                setUsername(event.target.value);
              }
            }/>
          </div>

          <div className="input-holder">
            <img
              src={passwordImage}
              className="input-image"
              alt="password"
            />
            <input type='text' className="input-element" placeholder='Enter Password' onChange={
              (event) => {
                setPasswords(event.target.value);
              }
            }/>
          </div>
          <button className="add-btn" onClick={addPassword}>Add</button>
        </form>

        <img
          src={largeImage}
          className="sub-div1-image1"
          alt="password manager"
        />
      </div>

      <div className="sub-div2">
        <div className="first-div">
          <div className="your-password">
            <h1 className="heading-name">Your Passwords</h1>
          </div>
          <div className="search-holder">
            <img
              src={searchImage}
              className="input-image"
              alt="search"
            />
            <input
              type="text"
              placeholder="Search website"
              className="input-element"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>
        <hr />
        <div className='Passwords'>
          <ul className="result-container">
          {passwordList
          .filter((val) => val.website.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((val, key) => {
            return (
              <li className="item-list">
                <div className='password' key={key} onClick={()=>{decryptPassword({password: val.password, iv: val.iv, id: val.id })}}>
                <p className="website">{val.website}<br />{val.username}</p>
                <button className="del-btn" onClick={() => deletePassword(val.id)}>
                  <img
                      src={deleteImage}
                      className="del-image"
                      alt="delete"
                    />
                </button> {/* Add delete button */}
                </div>
              </li>      
            );
            })} 
          </ul>    
        </div>
      </div>
    </div>
  );
}

export default App;
