import React from 'react';

const ItemCard = ({index}) => {
    return (
        <div key={index} className="item-placeholder">
            <div className="card-item-section">
                <h2>{Math.floor(Math.random()*1000)}</h2>
                <p>Item{index}</p>
            </div>
            <div className="card-info-section">
                <p>Слободни:</p>
                <p>#</p>
            </div>
        </div>
    );
};

export default ItemCard;
