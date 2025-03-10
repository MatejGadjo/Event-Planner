import React, { useEffect, useState } from "react";
import axios from "axios";

const ListItems = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get("http://localhost:3000/api/items");

                // Group data by categories and subcategories
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

                setCategories(Array.from(categoryMap.values()).map(cat => ({
                    ...cat,
                    subcategories: Array.from(cat.subcategories.values())
                })));
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Categories, Subcategories, and Items</h1>
            <ol>
                {categories.map(category => (
                    <li key={category.id}>
                        <strong>{category.name}</strong>
                        <div>
                            {category.items.map(item => (
                                <span className="list-pill" key={item.id}>
                                    <span>
                                        {item.name}
                                    </span>
                                    <span className="list-pill">
                                        +
                                    </span>
                                </span>
                            ))}
                            {category.subcategories.map(subcategory => (
                                <span key={subcategory.id}>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                               fill="currentColor" className="bi bi-arrow-return-right"
                                               viewBox="0 0 16 16">
  <path fill-rule="evenodd"
        d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5"/>
</svg>
                                    </span>
                                    <span>
                                        <strong>
                                            {subcategory.name}
                                        </strong>
                                    </span>
                                    <div>
                                        {subcategory.items.map(item => (
                                            <span className="list-pill" key={item.id}>
                                                <span>
                                                    {item.name}
                                                </span>
                                                <span className="list-pill">
                                                    +
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </span>
                            ))}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default ListItems;
