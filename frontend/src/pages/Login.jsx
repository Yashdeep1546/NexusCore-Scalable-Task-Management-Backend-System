import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials.');
    }
  };

  return (
    <div className="page-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="input-field"
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="input-field"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full-width">Login</button>
        </form>
        <div className="card-footer">
          Don't have an account? <Link to="/register" className="link-styled">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
