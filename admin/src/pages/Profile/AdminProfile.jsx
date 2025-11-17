import React from 'react';
import './AdminProfile.css';
import { assets } from '../../assets/assets';
import { useTranslation } from 'react-i18next';

const AdminProfile = () => {
  const { t } = useTranslation();
  // Placeholder de dados; em integração pegaremos do backend/localStorage
  const user = {
    name: 'Administrador',
    email: 'admin@exemplo.com',
    role: 'Admin',
    department: 'Operações'
  };
  const roleLabel = user.role === 'Super Admin' ? t('superAdmin') : t('admin');

  return (
    <div className="container-xl admin-profile-page">
      <div className="page-header">
        <h2 className="page-title">{t('adminProfileTitle')}</h2>
        <div className="btn-list">
          <button className="btn">{t('editProfile')}</button>
          <button className="btn">{t('changePassword')}</button>
          <button className="btn btn-primary">{t('saveChanges')}</button>
        </div>
      </div>

      {/* Grid de tiles inspirado no dashboard da referência */}
      <div className="tile-grid">
        <div className="tile">
          <div className="tile-header">
            <div className="d-flex align-items-center">
              <div className="tile-icon">👤</div>
              <div className="tile-title">{t('profile')}</div>
            </div>
            <div className="tile-add">+</div>
          </div>
          <div className="tile-body">
            {user.name} • {user.email}
          </div>
        </div>

        <div className="tile">
          <div className="tile-header">
            <div className="d-flex align-items-center">
              <div className="tile-icon">🔒</div>
              <div className="tile-title">{t('changePassword')}</div>
            </div>
            <div className="tile-add">+</div>
          </div>
          <div className="tile-body">
            {t('role')}: {roleLabel}
          </div>
        </div>

        <div className="tile">
          <div className="tile-header">
            <div className="d-flex align-items-center">
              <div className="tile-icon">⚙️</div>
              <div className="tile-title">{t('preferences')}</div>
            </div>
            <div className="tile-add">+</div>
          </div>
          <div className="tile-body">
            {t('department')}: {user.department}
          </div>
        </div>

        <div className="tile">
          <div className="tile-header">
            <div className="d-flex align-items-center">
              <div className="tile-icon">🔔</div>
              <div className="tile-title">{t('notifications')}</div>
            </div>
            <div className="tile-add">+</div>
          </div>
          <div className="tile-body">
            {t('privacy')}
          </div>
        </div>

        <div className="tile">
          <div className="tile-header">
            <div className="d-flex align-items-center">
              <div className="tile-icon">🕒</div>
              <div className="tile-title">{t('sessions')}</div>
            </div>
            <div className="tile-add">+</div>
          </div>
          <div className="tile-body">
            {/* Conteúdo breve para manter visual semelhante */}
            {t('sessions')}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <span className="avatar avatar-xl" style={{ backgroundImage: `url(${assets.profile_image})` }}></span>
            <div className="ms-3">
              <h3 className="mb-0">{user.name}</h3>
              <div className="text-muted">{user.email}</div>
              <div className="small text-secondary">{t('role')}: {roleLabel}{user.department ? ` • ${user.department}` : ''}</div>
            </div>
          </div>

          <div className="row mt-4 g-3">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">{t('name')}</label>
                <input type="text" className="form-control" defaultValue={user.name} />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">{t('email')}</label>
                <input type="email" className="form-control" defaultValue={user.email} />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">{t('department')}</label>
                <input type="text" className="form-control" defaultValue={user.department} />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">{t('role')}</label>
                <select className="form-select" defaultValue={user.role}>
                  <option value="Admin">{t('admin')}</option>
                  <option value="Super Admin">{t('superAdmin')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body">
          <h3 className="card-title">{t('preferences')}</h3>
          <div className="d-flex gap-3 flex-wrap">
            <button className="btn">{t('notifications')}</button>
            <button className="btn">{t('privacy')}</button>
            <button className="btn">{t('sessions')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;