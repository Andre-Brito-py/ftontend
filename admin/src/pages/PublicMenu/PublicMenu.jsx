import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PublicMenu.css';

const PublicMenu = ({ url }) => {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [menu, setMenu] = useState({ categories: [], foods: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const base = url || '';
        const storeRes = await axios.get(`${base}/api/store/public/${slug}`);
        if (!storeRes.data?.success || !storeRes.data?.store) {
          throw new Error(storeRes.data?.message || 'Loja não encontrada');
        }
        setStore(storeRes.data.store);

        const menuRes = await axios.get(`${base}/api/store/public/${slug}/menu`);
        if (!menuRes.data?.success || !menuRes.data?.menu) {
          throw new Error(menuRes.data?.message || 'Cardápio não disponível');
        }
        setMenu(menuRes.data.menu);
      } catch (err) {
        setError(err.message || 'Falha ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, url]);

  if (loading) {
    return <div className="public-menu"><p>Carregando cardápio...</p></div>;
  }

  if (error) {
    return <div className="public-menu"><p className="error">{error}</p></div>;
  }

  const storeId = store?._id;

  return (
    <div className="public-menu">
      <header className="store-header">
        <div className="store-info">
          <h1>{store?.name || 'Loja'}</h1>
          {store?.description && <p>{store.description}</p>}
        </div>
        {store?.customization?.bannerImage && (
          <img
            className="store-banner"
            src={`${url || ''}/images/${store.customization.bannerImage}${storeId ? `?storeId=${storeId}` : ''}`}
            alt="Banner da loja"
          />
        )}
      </header>

      <section className="categories-section">
        <h2>Categorias</h2>
        <div className="categories-grid">
          {menu.categories.map((cat) => (
            <div className="category-card" key={cat._id || cat.name}>
              <img
                src={`${url || ''}/images/${cat.image}${storeId ? `?storeId=${storeId}` : ''}`}
                alt={cat.name}
              />
              <div className="category-name">{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="foods-section">
        <h2>Itens</h2>
        <div className="foods-grid">
          {menu.foods.map((food) => (
            <div className="food-card" key={food._id || food.name}>
              {food.image && (
                <img
                  src={`${url || ''}/images/${food.image}${storeId ? `?storeId=${storeId}` : ''}`}
                  alt={food.name}
                />
              )}
              <div className="food-info">
                <div className="food-name">{food.name}</div>
                {food.description && <div className="food-desc">{food.description}</div>}
                {typeof food.price === 'number' && (
                  <div className="food-price">R$ {food.price.toFixed(2)}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PublicMenu;