import React from 'react';
import { FaPhone } from 'react-icons/fa';

const userData = [
    { name: "Име1", surname: "Презиме1", phone: "+38978663697" },
    { name: "Име2", surname: "Презиме2", phone: "+38978362676" },
    { name: "Име3", surname: "Презиме3", phone: "+38978495279" },
    { name: "Име4", surname: "Презиме4", phone: "+38978377443" },
    { name: "Име5", surname: "Презиме5", phone: "+38978817249" },
    { name: "Име6", surname: "Презиме6", phone: "+38978644686" },
    { name: "Име7", surname: "Презиме7", phone: "+38978801478" },
    { name: "Име8", surname: "Презиме8", phone: "+38978814567" },
    { name: "Име9", surname: "Презиме9", phone: "+38978856061" },
    { name: "Име10", surname: "Презиме10", phone: "+38978273625" },
    { name: "Име11", surname: "Презиме11", phone: "+38978550718" },
    { name: "Име12", surname: "Презиме12", phone: "+38978315854" },
    { name: "Име13", surname: "Презиме13", phone: "+38978667318" },
    { name: "Име14", surname: "Презиме14", phone: "+3897844019" },
    { name: "Име15", surname: "Презиме15", phone: "+38978770996" },
    { name: "Име16", surname: "Презиме16", phone: "+38978775951" },
    { name: "Име17", surname: "Презиме17", phone: "+38978568623" },
    { name: "Име18", surname: "Презиме18", phone: "+38978621427" },
    { name: "Име19", surname: "Презиме19", phone: "+38978698938" },
    { name: "Име20", surname: "Презиме20", phone: "+38978985873" },
    { name: "Име21", surname: "Презиме21", phone: "+38978683660" },
    { name: "Име22", surname: "Презиме22", phone: "+38978664709" },
    { name: "Име23", surname: "Презиме23", phone: "+38978418390" },
    { name: "Име24", surname: "Презиме24", phone: "+38978167706" },
    { name: "Име25", surname: "Презиме25", phone: "+38978946372" }
];

const UserGrid = () => {
    return (
        <div className="cards-user-grid">
            {userData.map((user, index) => (
                <div key={index} className="user-card">
                    <div className="user-info">
                        <h2 className="user-name">{user.name}</h2>
                        <h3 className="user-surname">{user.surname}</h3>
                        <div className="user-contact">
                            <FaPhone />
                            <span>{user.phone}</span>
                        </div>
                    </div>
                    <button className="details-button">Детали</button>
                </div>
            ))}
        </div>
    );
};

export default UserGrid;
