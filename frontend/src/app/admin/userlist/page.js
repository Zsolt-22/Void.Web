'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Message from '../../../components/ui/Message';
import Loader from '../../../components/ui/Loader';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const { userInfo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      const fetchUsers = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/users', {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          
          setUsers(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      
      fetchUsers();
    } else {
      router.push('/login');
    }
  }, [userInfo, router, deleteSuccess]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        
        if (!res.ok) throw new Error('Delete failed');
        setDeleteSuccess(!deleteSuccess);
        
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 uppercase tracking-wide">Users</h1>
      {error && <Message variant="danger">{error}</Message>}
      
      <div className="bg-white shadow-sm rounded-lg overflow-x-auto border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <a href={`mailto:${user.email}`} className="text-indigo-600 hover:text-indigo-900">{user.email}</a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.isAdmin ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {/* User edit logic goes here if needed */}
                  <button
                    className="text-red-600 hover:text-red-900 ml-4 focus:outline-none bg-red-100 p-2 rounded"
                    onClick={() => deleteHandler(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserListScreen;
