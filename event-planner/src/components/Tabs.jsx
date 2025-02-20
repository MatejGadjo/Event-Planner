import React from 'react';

const Tabs = () => {
    return (
        <div className="tabs-row">
            <button className="tab-button">
                Сите
            </button>
            {Array.from({ length: 10 }).map((_, index) => (
                <button key={index} className="tab-button">
                    Ресурс{index+1}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
