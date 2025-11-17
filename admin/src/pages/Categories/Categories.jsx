import React, { useState, useEffect } from 'react';
import './Categories.css';
import { toast } from 'react-toastify';
import axios from 'axios';

const Categories = ({ url }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeId = localStorage.getItem('storeId');
        const res = await axios.get(`${url}/api/category/list?storeId=${storeId}`);
        if (res.data?.success) {
          setCategories(res.data.data || []);
        } else {
          toast.error(res.data?.message || 'Erro ao carregar categorias');
        }
      } catch (err) {
        toast.error('Erro ao carregar categorias');
      }
    };
    fetchData();
  }, [url]);

  return (
    <div className="categories">
      <div className="categories-header">
        <h2>Gerenciar Categorias</h2>
      </div>
      <div className="categories-list">
        <h3>Categorias Cadastradas</h3>
        {categories.length === 0 ? (
          <p className="no-categories">Nenhuma categoria cadastrada</p>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => {
              const storeId = localStorage.getItem('storeId');
              const img = category.image || '';
              const isAbsolute = typeof img === 'string' && img.startsWith('/');
              const qs = storeId ? `?storeId=${storeId}` : '';
              const src = isAbsolute ? `${url}${img}${qs}` : `${url}/images/${img}${qs}`;
              return (
                <div key={category._id} className={`category-card ${!category.isActive ? 'inactive' : ''}`}>
                  <div className="category-image">
                    <img src={src} alt={category.name} />
                  </div>
                  <div className="category-info">
                    <h4>{category.name}</h4>
                    <p>{category.description || 'Sem descrição'}</p>
                    <span className={`status ${category.isActive ? 'active' : 'inactive'}`}>
                      {category.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;