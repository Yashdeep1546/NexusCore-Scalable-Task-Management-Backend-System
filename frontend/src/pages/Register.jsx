import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register with all three values: email, password, and chosen role
      const { data } = await API.post('/auth/register', { email, password, role });
      login(data.token); // Immediately log them in
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div className="page-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
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
            <select value={role} onChange={(e) => setRole(e.target.value)} className="select-field">
              <option value="" disabled>Select User Role</option> 
              <option value="user">Standard User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-full-width">Register</button>
        </form>
        <div className="card-footer">
          Already have an account? <Link to="/login" className="link-styled">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
