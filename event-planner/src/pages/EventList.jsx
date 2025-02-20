import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EventGrid from "../components/EventGrid";

import "./css/EventList.css";
import "../App.css";

const EventList = () => {
    return (
        <div className="app-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">E·QUIP<sup> мк</sup></div>
                <div className="search-bar">
                    <input type="text" placeholder="Search" className="search-input" />
                    <button className="search-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-search" viewBox="0 0 16 16">
                            <path
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                    </button>
                </div>
                <div className={"navbar-buttons"}>
                    <div className={"navbar-button"}>
                        НАЈАВИ СЕ</div>
                    <div className={"notification-button"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-bell" viewBox="0 0 16 16">
                            <path
                                d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
                        </svg>
                    </div>
                </div>
            </nav>

            <div className={"whole-container"}>
                <div>
                    {/* Tabs Row */}
                    <div className="tabs-row">
                        {['Сите', 'Item1', 'Item2'].map((tab, index) => (
                            <button key={index} className="tab-button">
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="sidenav">
                        {
                            <div>
                                <a href={'/'} className="sidenav-button">
                                    <div className={"sidebar-tab-icon"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                             className="bi bi-person" viewBox="0 0 16 16">
                                            <path
                                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                        </svg>
                                    </div>
                                    <p>Профил</p>
                                </a>
                                <a href={'/eventlist'} className="sidenav-button">
                                    <div className={"sidebar-tab-icon"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                             className="bi bi-megaphone" viewBox="0 0 16 16">
                                            <path
                                                d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z"/>
                                        </svg>
                                    </div>
                                    <p>Јавни</p>
                                </a>
                                <a href={'/eventlist'} className="sidenav-button">
                                    <div className={"sidebar-tab-icon"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                             fill="currentColor" className="bi bi-shield-lock" viewBox="0 0 16 16">
                                            <path
                                                d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
                                            <path
                                                d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/>
                                        </svg>
                                    </div>
                                    <p>Приватни</p>
                                </a>
                                <a href={'/userslist'} className="sidenav-button">
                                    <div className={"sidebar-tab-icon"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                             fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                                            <path
                                                d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                                        </svg>
                                    </div>
                                    <p>Корисници</p>
                                </a>
                            </div>
                        }
                    </div>
                </div>

                {/* Content */}
                <div className="video-grid">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div key={index} className="video-placeholder">
                            <div className="card-top-section">
                                <div className="card-date-placeholder">
                                    <p className="card-date-day">Пон</p>
                                    <h2 className="card-date-date">{index+1}</h2>
                                    <p className="card-date-month">Јан</p>
                                </div>
                                <div className="card-title-placeholder">
                                    <p className="card-title-creator">Креатор</p>
                                    <h2 className="card-title-title">Име на настан</h2>
                                    <div className="card-title-info">
                                        <p className="card-title-location">Локација</p>
                                        <p className="card-title-time">00:00 - 23:59</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-bottom-section">
                                <div className="card-pills">
                                    {Array.from({ length: Math.floor(Math.random()*(20-1)+1) }).map((_, index) => (
                                        <span className="card-pill"> pill{index}<span>{Math.floor(Math.random()*(1000-1)+1)}</span></span>
                                        ))}
                                    {/*<p>placeholder</p>*/}
                                    {/*<p>placeholder</p>*/}
                                </div>
                                <div className="card-bottom-info">
                                    <p className="card-num-offers">0 понуди</p>
                                    <p className="card-offer">понуди ресурси </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventList;