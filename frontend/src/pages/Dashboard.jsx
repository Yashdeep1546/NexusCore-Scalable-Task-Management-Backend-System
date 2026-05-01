import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  
  // Normal User State
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  
  // Admin State
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminTasks, setAdminTasks] = useState([]);
  const [activeAdminTab, setActiveAdminTab] = useState('users'); // 'users' or 'tasks'
  
  // Add User Form State
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');

  useEffect(() => {
    fetchMyTasks();
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  // --- STANDARD USER FUNCTIONS ---
  const fetchMyTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) { console.error('Failed to fetch tasks', err); }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const { data } = await API.post('/tasks', { title });
      setTasks([...tasks, data]);
      setTitle('');
    } catch (err) { console.error('Failed to add task', err); }
  };

  const updateTask = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      const { data } = await API.put(`/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map((t) => (t.id === id ? data : t)));
    } catch (err) { console.error('Failed to update task', err); }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) { console.error('Failed to delete task', err); }
  };

  // --- ADMIN FUNCTIONS ---
  const fetchAdminData = async () => {
    try {
      const usersRes = await API.get('/admin/users');
      setAdminUsers(usersRes.data);
      const tasksRes = await API.get('/admin/tasks');
      setAdminTasks(tasksRes.data);
    } catch (err) { console.error('Failed to fetch admin data', err); }
  };

  const adminAddUser = async (e) => {
    e.preventDefault();
    try {
      // We can use the existing register route to create a user!
      await API.post('/auth/register', { email: newEmail, password: newPassword, role: newRole });
      setNewEmail(''); setNewPassword(''); setNewRole('user');
      fetchAdminData(); // Refresh the list
      alert('User added successfully!');
    } catch (err) { alert('Failed to add user'); }
  };

  const adminDeleteUser = async (id) => {
    if(!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setAdminUsers(adminUsers.filter(u => u.id !== id));
    } catch (err) { console.error('Failed to delete user', err); }
  };

  const adminDeleteAnyTask = async (id) => {
    if(!window.confirm('Are you sure you want to delete this system task?')) return;
    try {
      await API.delete(`/admin/tasks/${id}`);
      setAdminTasks(adminTasks.filter(t => t.id !== id));
    } catch (err) { console.error('Failed to delete task', err); }
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const isCompleted = status === 'completed';
    return (
      <div className={`status-badge ${isCompleted ? 'status-badge-completed' : 'status-badge-pending'}`}>
        <span className="status-indicator-dot"></span>
        {isCompleted ? 'Completed' : 'Pending'}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="card-header dashboard-actions-bar">
        <h1 className="page-title">Welcome, {user?.email}</h1>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
           <span style={{fontSize: '14px', color: '#6b7280'}}>Role: <strong>{user?.role.toUpperCase()}</strong></span>
           <button onClick={logout} className="btn btn-primary btn-small">Logout</button>
        </div>
      </div>

      {/* --- ADMIN PANEL --- */}
      {user?.role === 'admin' && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #ef4444', padding: '20px', borderRadius: '8px', marginBottom: '40px' }}>
          <h2 style={{ color: '#991b1b', marginBottom: '15px' }}>👑 Administrator Control Panel</h2>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => setActiveAdminTab('users')} className={`btn btn-small ${activeAdminTab === 'users' ? 'btn-danger' : 'btn-primary'}`}>Manage Users</button>
            <button onClick={() => setActiveAdminTab('tasks')} className={`btn btn-small ${activeAdminTab === 'tasks' ? 'btn-danger' : 'btn-primary'}`}>All System Tasks</button>
          </div>

          {activeAdminTab === 'users' && (
            <>
              {/* Add User Form inside Admin Panel */}
              <form onSubmit={adminAddUser} style={{ display: 'flex', gap: '10px', marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '8px' }}>
                <input type="email" placeholder="New User Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required className="input-field" style={{padding: '8px'}} />
                <input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="input-field" style={{padding: '8px'}} />
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="select-field" style={{padding: '8px', width: 'auto'}}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" className="btn btn-accent btn-small">Add User</button>
              </form>

              {/* Users Table */}
              <div className="task-table-wrapper">
                <div className="task-header-row">
                  <div style={{flex: 3}}>User Email</div>
                  <div style={{flex: 1}}>Role</div>
                  <div style={{flex: 1, textAlign: 'right'}}>Actions</div>
                </div>
                <ul className="task-list">
                  {adminUsers.map(u => (
                    <li key={u.id} className="task-item">
                      <div style={{flex: 3, fontWeight: '500'}}>{u.email}</div>
                      <div style={{flex: 1}}>
                        <span style={{background: u.role === 'admin' ? '#fef08a' : '#e5e7eb', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{u.role}</span>
                      </div>
                      <div style={{flex: 1, textAlign: 'right'}}>
                        <button onClick={() => adminDeleteUser(u.id)} className="btn btn-danger btn-small" disabled={u.id === user.id}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {activeAdminTab === 'tasks' && (
             <div className="task-table-wrapper">
               <div className="task-header-row">
                 <div style={{flex: 3}}>Task Title</div>
                 <div style={{flex: 1}}>Status</div>
                 <div style={{flex: 1, textAlign: 'right'}}>Actions</div>
               </div>
               <ul className="task-list">
                 {adminTasks.map(t => (
                   <li key={t.id} className="task-item">
                     <div style={{flex: 3}}>{t.title}</div>
                     <div style={{flex: 1}}><StatusBadge status={t.status} /></div>
                     <div style={{flex: 1, textAlign: 'right'}}>
                       <button onClick={() => adminDeleteAnyTask(t.id)} className="btn btn-danger btn-small">Delete</button>
                     </div>
                   </li>
                 ))}
               </ul>
             </div>
          )}
        </div>
      )}
      {/* --- END ADMIN PANEL --- */}

      {/* --- STANDARD USER DASHBOARD --- */}
      <div className="dashboard-actions-bar">
        <h2>My Personal Tasks</h2>
        <form onSubmit={addTask} className="add-task-form">
          <input type="text" placeholder="Add a new personal task..." value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field" />
          <button type="submit" className="btn btn-accent btn-small">Add Task</button>
        </form>
      </div>

      <div className="task-table-wrapper">
        <div className="task-header-row">
          <div className="task-col-title">Task</div>
          <div className="task-col-status">Status</div>
          <div className="task-col-actions">Actions</div>
        </div>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-item ${task.status === 'completed' ? 'task-completed' : ''}`}>
              <div className="task-col-title task-title-text">{task.title}</div>
              <div className="task-col-status"><StatusBadge status={task.status} /></div>
              <div className="task-col-actions task-actions-wrapper">
                <button onClick={() => updateTask(task.id, task.status)} className="btn btn-small btn-primary">
                  {task.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
                </button>
                <button onClick={() => deleteTask(task.id)} className="btn btn-small btn-danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

export default Dashboard;
