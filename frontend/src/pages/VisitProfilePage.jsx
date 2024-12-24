import { useContext, React, useState, useEffect } from 'react';
import { AuthContext } from '../agils/checkAuth';
import Navbar from '../components/Navbar';
import { profilePictures } from '../services/getProfilePictures';
import ChooseImage from '../components/ChooseImage';
import '../styles/profilePage.css';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';



function VisitProfilePage() {
const { userInfo } = useContext(AuthContext);
const [profilePicture, setProfilePicture] = useState(null);
const [visitedProfile, setVisitedProfile] = useState(null);
const [friendStatus, setFriendStatus] = useState("add friend");
const [posts, setPosts] = useState([]);
const { userId } = useParams();


async function prepareProfile() {
    try {
        console.log("loaded page", userId);
        const response = await axios.get(`http://localhost:5000/users/visitProfile/${userId}`);
        console.log("response where I hope both user details and post details are", response);
        setPosts(response.data.posts);
        setVisitedProfile(response.data.user);
            const foundImage = (profilePictures.find(picture => picture.name === response.data.user.profilePicture));
            console.log("foundImage", foundImage);
            setProfilePicture(foundImage.src);
          userInfo.friends.map(friend => { if (friend.userId === userId) { setFriendStatus("friends"); } });
            userInfo.sentFriendRequests.map(request => { if (request.userId === userId) { setFriendStatus("received"); } });
            userInfo.friendRequests.map(request => { if (request.userId === userId) { setFriendStatus("sent"); } });
           
    } catch (error) {
        console.error('Error getting posts:', error);
    }
}


async function FriendStatusHandler() {
    try {
      console.log("loaded page", userId);
        const response = await axios.post(`http://localhost:5000/users/friendStatusLogic`, { userId }, {withCredentials: true});
        console.log("friend adding response response", response);
    } catch (error) {
        console.error('Error getting friend status:', error);
    }
}



useEffect(() => {
  prepareProfile();
}
, []);








    return (
      <div> 
        <Navbar />
        <div className="profile-container">
            <h1>Profile</h1>
            <div className="profile-details">
            <div className='profilePage-profilePictureContainer'>
              {profilePicture && ( <>  <img src={profilePicture} alt="Profile" /> </> )}
            </div>
            {visitedProfile && (
                        <>
                            <p><strong>Username:</strong> {visitedProfile.userName}</p>
                            <p><strong>Email:</strong> {visitedProfile.email}</p>
                            <p><strong>Joined:</strong> {visitedProfile.joinedDate}</p>
                        </>
                    )}
            </div>
            <button className="profilePage-addFriendButton" onClick={FriendStatusHandler} > {friendStatus} </button>
            <div className="profilePage-posts">
                <h2>Posts</h2>
                {posts.map(post => (
                    <div key={post._id} className="profilePage-post">
                        <h3 className='profilePage-postTitle' >{post.title}</h3>
                        <p className='profilePage-postTextArea' >{post.textAreaContent}</p>
                    </div>
                ))}
        </div>
        </div>
        </div>
    );
}

export default VisitProfilePage;