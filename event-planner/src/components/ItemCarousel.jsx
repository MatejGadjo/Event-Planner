import React from 'react';
import ItemCard from './ItemCard';

const ItemCarousel = () => {
    return (
        <div className="item-cards-grid">
            {Array.from({ length: 20 }).map((_, index) => (
                <ItemCard index={index}></ItemCard>
            ))}
        </div>
    );
};

export default ItemCarousel;
