import React, { useState } from 'react';

// ⚡ Bolt Performance Optimization:
// Moved `authForm` state out of App.jsx into this dedicated AuthForm component.
// Previously, every keystroke in the login form updated App.jsx's state,
// causing a full re-render of the entire application tree (including all TripCards).
// By localizing the state here, typing in the form only re-renders this tiny component,
// significantly improving performance.
const AuthForm = ({ onSubmit }) => {
  const [authForm, setAuthForm] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(authForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        aria-label="Nome"
        type="text"
        placeholder="Nome"
        className="w-full border p-2 rounded"
        value={authForm.name}
        onChange={e => setAuthForm({...authForm, name: e.target.value})}
      />
      <input
        aria-label="Email"
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        value={authForm.email}
        onChange={e => setAuthForm({...authForm, email: e.target.value})}
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">
        Entrar
      </button>
    </form>
  );
};

export default AuthForm;
