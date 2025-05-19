import React from "react";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

import "./css/EventForm.css";
import "../App.css";
import ListItems from "../components/Example/ListItems.jsx";

const EventCreate = ({ user }) => {
    return (
        <div className="app-container">
            <Navbar user={user}></Navbar>
            <div className={"main-container"}>
                <div>
                    <Sidebar></Sidebar>
                </div>

                <div className={"form-container"}>
                    <div className="event-form">
                        <h2>Креирај Настан</h2>

                        <div className="event-form-title">
                            <label>Наслов</label>
                            <div className="event-form-title-input">
                                <input type="text"/>
                                <span className="event-form-checkbox">
                                    <p>Приватен</p>
                                    <input id={"form-checkbox"} type={"checkbox"}/>
                                </span>
                            </div>
                        </div>

                        <div className="event-form-date">
                            <div className="event-form-date-label">
                                <label>Датум</label>
                                <input type="date"/>
                            </div>

                            <div className="event-form-date-label">
                                <label>Почеток</label>
                                <input type="time" defaultValue={"00:00"}/>
                            </div>

                            <div className="event-form-date-label">
                                <label>Крај</label>
                                <input type="time" defaultValue={"23:59"}/>
                            </div>
                        </div>

                        <div className="event-form-location">
                            <label>Локација</label>
                            <input type="text"/>
                        </div>

                        <div>
                            <label>Потребни ресурси</label>
                            <div className="event-form-resources-box">
                                <div className="card-pills">
                                    {Array.from({ length: Math.floor(Math.random()*(20-1)+1) }).map((_, index) => (
                                        <span className="card-pill"> Ресурс {index}<span>{Math.floor(Math.random()*(1000-1)+1)}</span></span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="event-form-resources-list">
                        <h3>Ресурси</h3>
{/*                        <div className="search-bar">
                            <input type="search" placeholder="Пребарувај ресурси" className="search-input"/>
                            <button className="search-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-search" viewBox="0 0 16 16">
                                    <path
                                        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                </svg>
                            </button>
                        </div>*/}
{/*                        <ul>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <li>Ресурс {index+1}</li>
                            ))}
                        </ul>*/}
                        <ListItems/>
                    </div>

                </div>

            </div>
        </div>
    )
};

export default EventCreate;