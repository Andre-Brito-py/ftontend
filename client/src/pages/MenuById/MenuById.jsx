import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MenuById = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setStatus({ loading: true, error: null });
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4001';
        const res = await fetch(`${base}/api/store/public/id/${storeId}`);
        const data = await res.json();
        if (data?.success && data.store?.slug) {
          navigate(`/loja/${data.store.slug}`, { replace: true });
        } else {
          setStatus({ loading: false, error: 'Loja não encontrada ou inativa' });
        }
      } catch (err) {
        console.error('Erro ao buscar loja por ID:', err);
        setStatus({ loading: false, error: 'Erro ao carregar dados da loja' });
      }
    };
    if (storeId) fetchStore();
  }, [storeId, navigate]);

  if (status.loading) {
    return (
      <div className="store-loading">
        <div className="loading-spinner"></div>
        <p>Carregando loja...</p>
      </div>
    );
  }

  return (
    <div className="store-error">
      <h2>Loja não encontrada</h2>
      <p>{status.error || 'Verifique o QR Code ou tente novamente mais tarde.'}</p>
      <a href="/" className="btn-home">Voltar ao início</a>
    </div>
  );
};

export default MenuById;