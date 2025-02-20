import React from 'react';

const UserCard = ({index}) => {
    return (
        <div key={index} className="card-user-placeholder">
            <div className="card-user-image"></div>
            <div className="card-user-top-section">
                <p className="card-user-name"><b>Име{index+1}</b></p>
                <p className="card-user-surname"><b>Презиме{index+1}</b></p>
                <p className="card-user-contact">+38978{Math.floor(Math.random()*1000000)}</p>
                <button className="card-user-button navbar-button">Детали</button>
            </div>
        </div>
    );
};

export default UserCard;
