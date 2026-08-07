import React from 'react';
import Modal from './Modal';

const AuthForm = ({ onLogin }) => {
  const [authForm, setAuthForm] = React.useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(authForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input aria-label="Nome" type="text" placeholder="Nome" className="w-full border p-2 rounded" onChange={e => setAuthForm({...authForm, name: e.target.value})} />
      <input aria-label="Email" type="email" placeholder="Email" className="w-full border p-2 rounded" onChange={e => setAuthForm({...authForm, email: e.target.value})} />
      <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">Entrar</button>
    </form>
  );
};

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Acesse sua conta">
      <AuthForm onLogin={onLogin} />
    </Modal>
  );
};

export default AuthModal;
