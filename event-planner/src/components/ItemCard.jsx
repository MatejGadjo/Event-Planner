import React from 'react';
import './css/ItemCard.css';

const ItemCard = ({ resource }) => {
    return (
        <div className="item-card">
            <div className="item-header">
                <h3 className="item-title">{resource.name}</h3>
                <span className="item-category">{resource.category}</span>
            </div>
            <div className="item-body">
                <p className="item-description">{resource.description}</p>
                <div className="item-stats">
                    <div className="item-stat">
                        <span className="stat-label">Вкупно:</span>
                        <span className="stat-value">{resource.quantity}</span>
                    </div>
                    <div className="item-stat">
                        <span className="stat-label">Слободни:</span>
                        <span className="stat-value">{resource.available}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;
