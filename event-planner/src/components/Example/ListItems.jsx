import React, { useEffect, useState } from "react";
import axios from "axios";

import "../../App.css";
import "../css/styles.css"

const ListItems = () => {
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [expandedSubcategories, setExpandedSubcategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get("http://localhost:3000/api/items");

                const categoryMap = new Map();

                data.forEach(item => {
                    if (!categoryMap.has(item.category_id)) {
                        categoryMap.set(item.category_id, {
                            id: item.category_id,
                            name: item.category_name,
                            subcategories: new Map(),
                            items: []
                        });
                    }

                    const category = categoryMap.get(item.category_id);

                    if (item.subcategory_id) {
                        if (!category.subcategories.has(item.subcategory_id)) {
                            category.subcategories.set(item.subcategory_id, {
                                id: item.subcategory_id,
                                name: item.subcategory_name,
                                items: []
                            });
                        }
                        category.subcategories.get(item.subcategory_id).items.push(item);
                    } else {
                        category.items.push(item);
                    }
                });

                const finalCategories = Array.from(categoryMap.values()).map(cat => ({
                    ...cat,
                    subcategories: Array.from(cat.subcategories.values())
                }));

                setCategories(finalCategories);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const toggleCategory = (id) => {
        setExpandedCategories(prev => {
            const newExpanded = {};
            categories.forEach(category => {
                newExpanded[category.id] = category.id === id ? !prev[id] : false;
            });
            return newExpanded;
        });

        // Collapse all subcategories when switching categories
        setExpandedSubcategories({});
    };

    const toggleSubcategory = (id) => {
        setExpandedSubcategories(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={"list-resources"}>
            <ul className={"list-item"}>
                {categories.map(category => (
                    <li className={"list-item"} key={category.id}>
                        <div className={"list-item-toggle"} onClick={() => toggleCategory(category.id)}>
                            {category.name}
                        </div>

                        {expandedCategories[category.id] && (
                            <ul className={"list-expendable-box"}>
                                {category.items.map(item => (
                                    <li className={"list-item"} key={item.id}>
                                        {item.name}
                                        <span className={"list-item-add"}>+</span>
                                    </li>
                                ))}

                                {category.subcategories.map(sub => (
                                    <li className={"list-item"} key={sub.id}>
                                        <div className={"list-item-toggle"} onClick={() => toggleSubcategory(sub.id)}>
                                            {sub.name}
                                        </div>
                                        {expandedSubcategories[sub.id] && (
                                            <ul className={"list-expendable-box"}>
                                                {sub.items.map(item => (
                                                    <li className={"list-item"} key={item.id} >
                                                        {item.name}
                                                        <span className={"list-item-add"}>+</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListItems;
