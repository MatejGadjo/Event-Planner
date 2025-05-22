import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import './css/AddResourcePopup.css';

const AddResourcePopup = ({ isOpen, onClose, user }) => {
    const [formData, setFormData] = useState({
        description: '',
        quantity: 1,
        category: '',
        itemType: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = {
        "Инструменти": ["Бубњеви", "Тапан", "Конги", "Тарабука", "Гитара", "Бас Гитара", "Виолина", "Виолончело", "Контрабас", "Харфа", "Хармоника", "Синтисајзер", "Пијано", "Труба", "Флејта", "Кларинет", "Саксофон", "Гајда", "Зурла"],
        "Угостителство": ["Бармен", "Келнер", "Готвач"],
        "Кетеринг": ["Чаши", "Тањири", "Прибор", "Чаршаф", "Прилог храна", "Камиони за храна", "Машинa за сладолед", "Машина за пуканки", "Машина за шеќерна волна", "Фонтани за чоколадо"],
        "Монтажна Опрема": ["Микрофон", "Звучник", "Миксета", "Камера", "Проектор", "LED дисплеј", "Рефлектор", "LED панел", "Ласер", "Платформа", "Шатор", "Подиум", "Бекдроп", "Барикади", "Надстрешница", "Фото Кабина", "Пренослив тоалет"],
        "Мебел": ["Маса", "Барска маса", "Клуб маса", "Стол", "Барски стол", "Сепаре стол", "Клупа", "Песочна вреќа"],
        "Декорации": ["Балони", "Реквизити", "Цветови"],
        "Изведувачи": ["Пејач", "Бенд", "Диџеј", "Хор", "Танцувачи", "Играорци", "Мажоретки"],
        "Транспорт": ["Автомобил", "Лимузина", "Патничко Комбе", "Автобус", "Товарно Возило", "Пајтон"],
        "Рекламни Услуги": ["Флаери", "Банери", "Онлајн маркетинг", "Брендирани подароци"],
        "Фото и Видео Сервиси": ["Фотограф", "Камерман", "Дрон камера"],
        "Модна Промоција": ["Стилист", "Шминкер", "Фризер"],
        "Техничка Поддршка": ["Аудио Техничар", "Видео Tехничар", "Инсталатер", "Електричар", "Агрегат"],
        "Безбедносна Поддршка": ["Обезбедување", "Надзорна опрема", "Системи за контрола на влез", "Медицински тим", "ППЕ Апарат"],
        "Забавни Активности": ["Топка", "Гол", "Кош", "Мрежа", "Комедијант", "Детски аниматор", "Куклена претстава", "VR/AR Кабина", "Интерактивен панел", "Тркачки симулатор"]
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const resourceData = {
                ...formData,
                name: formData.itemType || formData.category,
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
            [name]: value,
            // Reset itemType when category changes
            ...(name === 'category' && { itemType: '' })
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
                        <label htmlFor="description">Опис</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Внесете опис"
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
                            placeholder="Внесете количина"
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
                            {Object.keys(categories).map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {formData.category && categories[formData.category] && (
                        <div className="form-group">
                            <label htmlFor="itemType">Тип</label>
                            <select
                                id="itemType"
                                name="itemType"
                                value={formData.itemType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Изберете тип</option>
                                {categories[formData.category].map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {error && <p className="error-message">{error}</p>}
                    
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Додавање...' : 'Додади'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddResourcePopup; 