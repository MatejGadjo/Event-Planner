import React from 'react';
import UserCard from './UserCard';

const UserGrid = () => {
    return (
        <div className="cards-user-grid">
            {Array.from({ length: 25 }).map((_, index) => (
                <UserCard index={index}></UserCard>
            ))}
        </div>
    );
};

export default UserGrid;
