import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import './css/AddResourcePopup.css';

const AddResourcePopup = ({ isOpen, onClose, user }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: 1,
        category: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const resourceData = {
                ...formData,
                userId: user.uid,
                createdAt: new Date().toISOString(),
                available: formData.quantity
            };

            await addDoc(collection(db, "resources"), resourceData);
            onClose();
        } catch (err) {
            setError('Грешка при додавање на ресурсот. Обидете се повторно.');
            console.error("Error adding resource: ", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Додади нов ресурс</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Име на ресурсот</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Внесете име на ресурсот"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Опис</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Внесете опис на ресурсот"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">Количина</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Категорија</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Изберете категорија</option>
                            <option value="sound">Звучна опрема</option>
                            <option value="light">Светлосна опрема</option>
                            <option value="stage">Сцена</option>
                            <option value="furniture">Мебел</option>
                            <option value="other">Друго</option>
                        </select>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Додавање...' : 'Додади ресурс'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddResourcePopup; 