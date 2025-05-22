import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, query, where, onSnapshot, getDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "./css/EventForm.css";
import "../App.css";

const EventCreate = ({ user }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        isPrivate: false,
        date: '',
        startTime: '00:00',
        endTime: '23:59',
        location: '',
        description: '',
        resources: []
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showQuantityDialog, setShowQuantityDialog] = useState(false);
    const [selectedTypeForQuantity, setSelectedTypeForQuantity] = useState(null);
    const [quantity, setQuantity] = useState(1);

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
        setError('');
        setIsSubmitting(true);

        if (!user) {
            setError('Мора да бидете најавени за да креирате настан');
            setIsSubmitting(false);
            return;
        }

        try {
            // Validate required fields
            if (!formData.title || !formData.date || !formData.location) {
                setError('Сите полиња се задолжителни');
                setIsSubmitting(false);
                return;
            }

            const eventData = {
                ...formData,
                userId: user.uid,
                createdAt: new Date().toISOString(),
                status: 'active',
                visibility: formData.isPrivate ? 'private' : 'public'
            };

            console.log('Creating event with data:', eventData);
            const docRef = await addDoc(collection(db, "events"), eventData);
            console.log("Event created with ID: ", docRef.id);
            
            // Navigate to the appropriate page based on visibility
            if (formData.isPrivate) {
                navigate('/events/private');
            } else {
                navigate('/events/public');
            }
        } catch (error) {
            console.error("Error creating event: ", error);
            setError('Грешка при креирање на настанот. Обидете се повторно.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTypeClick = (type) => {
        setSelectedTypeForQuantity(type);
        setQuantity(1);
        setShowQuantityDialog(true);
    };

    const handleQuantitySubmit = () => {
        if (selectedTypeForQuantity) {
            const newResource = {
                id: Date.now().toString(),
                name: selectedTypeForQuantity,
                category: selectedCategory,
                itemType: selectedTypeForQuantity,
                quantity: quantity
            };
            
            setFormData(prev => ({
                ...prev,
                resources: [...prev.resources, newResource]
            }));

            setShowQuantityDialog(false);
            setSelectedTypeForQuantity(null);
            setQuantity(1);
        }
    };

    const addResource = (type, quantity) => {
        const newResource = {
            id: Date.now().toString(),
            name: type,
            category: selectedCategory,
            itemType: type,
            quantity: quantity
        };
        
        setFormData(prev => ({
            ...prev,
            resources: [...prev.resources, newResource]
        }));
    };

    const getFilteredTypes = () => {
        if (!selectedCategory) return [];
        return categories[selectedCategory] || [];
    };

    return (
        <div className="app-container">
            <Navbar user={user} />
            <div className="main-container">
                <Sidebar />
                <div className="form-container">
                    <form className="event-form" onSubmit={handleSubmit}>
                        <h2>Креирај Настан</h2>
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-section">
                            <div className="event-form-title">
                                <label>Наслов</label>
                                <div className="event-form-title-input">
                                    <input 
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Внесете наслов на настанот"
                                        required
                                    />
                                    <span className="event-form-checkbox">
                                        <p>Приватен</p>
                                        <input 
                                            id="form-checkbox"
                                            type="checkbox"
                                            name="isPrivate"
                                            checked={formData.isPrivate}
                                            onChange={handleInputChange}
                                        />
                                    </span>
                                </div>
                            </div>

                            <div className="event-form-date">
                                <div className="event-form-date-label">
                                    <label>Датум</label>
                                    <input 
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="event-form-date-label">
                                    <label>Почеток</label>
                                    <input 
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="event-form-date-label">
                                    <label>Крај</label>
                                    <input 
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="event-form-location">
                                <label>Локација</label>
                                <input 
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Внесете локација на настанот"
                                    required
                                />
                            </div>

                            <div className="event-form-description">
                                <label>Опис</label>
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleInputChange}
                                    placeholder="Внесете опис на настанот"
                                    rows="4"
                                />
                            </div>

                            <div className="event-form-resources">
                                <label>Потребни ресурси</label>
                                <div className="event-form-resources-box">
                                    <div className="card-pills">
                                        {formData.resources.map((resource, index) => (
                                            <span key={index} className="card-pill">
                                                {resource.name} ({resource.quantity})
                                                <button 
                                                    type="button"
                                                    className="remove-resource"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            resources: prev.resources.filter((_, i) => i !== index)
                                                        }));
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Креирање...' : 'Креирај настан'}
                            </button>
                        </div>
                    </form>

                    <div className="event-form-resources-list">
                        <h3>Додади ресурси</h3>
                        <div className="resource-filters">
                            <div className="form-group">
                                <label htmlFor="category">Категорија</label>
                                <select
                                    id="category"
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        setSelectedType('');
                                    }}
                                    required
                                >
                                    {Object.keys(categories).map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="resources-list">
                            {getFilteredTypes().map(type => (
                                <div 
                                    key={type} 
                                    className="resource-item"
                                    onClick={() => handleTypeClick(type)}
                                >
                                    <div className="resource-info">
                                        <h4>{type}</h4>
                                        <span className="resource-status">Достапни</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {showQuantityDialog && (
                            <div className="quantity-dialog">
                                <div className="quantity-dialog-content">
                                    <h3>Внесете количина</h3>
                                    <div className="quantity-input">
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        />
                                    </div>
                                    <div className="quantity-dialog-buttons">
                                        <button 
                                            className="cancel-button"
                                            onClick={() => {
                                                setShowQuantityDialog(false);
                                                setSelectedTypeForQuantity(null);
                                                setQuantity(1);
                                            }}
                                        >
                                            Откажи
                                        </button>
                                        <button 
                                            className="confirm-button"
                                            onClick={handleQuantitySubmit}
                                        >
                                            Потврди
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCreate;