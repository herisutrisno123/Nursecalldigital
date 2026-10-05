import { useState } from 'react';
import { nurses } from '../data/mockData';

interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  email: string;
  status: 'active' | 'inactive';
  last_login: string;
  created_at: string;
}

const users: User[] = [
  { id: 'U001', username: 'admin', name: 'Administrator', role: 'admin', email: 'admin@hospital.com', status: 'active', last_login: '2026-01-15T08:00:00', created_at: '2024-01-01' },
  { id: 'U002', username: 'operator1', name: 'Nurse Dewi', role: 'operator', email: 'dewi@hospital.com', status: 'active', last_login: '2026-01-15T07:30:00', created_at: '2024-01-01' },
  { id: 'U003', username: 'operator2', name: 'Nurse Rina', role: 'operator', email: 'rina@hospital.com', status: 'active', last_login: '2026-01-15T07:45:00', created_at: '2024-01-01' },
  { id: 'U004', username: 'viewer1', name: 'Dr. Ahmad', role: 'viewer', email: 'ahmad@hospital.com', status: 'active', last_login: '2026-01-14T16:00:00', created_at: '2024-02-01' },
  { id: 'U005', username: 'operator3', name: 'Nurse Maya', role: 'operator', email: 'maya@hospital.com', status: 'inactive', last_login: '2026-01-10T12:00:00', created_at: '2024-03-01' },
];

export default function Accounts() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'nurses'>('users');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            <i className="fas fa-users mr-2"></i>Akun Pengguna
          </button>
          <button
            onClick={() => setActiveTab('nurses')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'nurses' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            <i className="fas fa-user-nurse mr-2"></i>Data Perawat
          </button>
        </div>
        {activeTab === 'users' && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            <i className="fas fa-plus mr-2"></i>Tambah Akun
          </button>
        )}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Username</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nama</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Login Terakhir</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{user.username}</td>
                  <td className="px-4 py-3 text-gray-700">{user.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'operator' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-xs ${user.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(user.last_login).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-xs"><i className="fas fa-edit"></i></button>
                      <button className="text-red-600 hover:text-red-800 text-xs"><i className="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Nurses Tab */}
      {activeTab === 'nurses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nurses.map(nurse => (
            <div key={nurse.id} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{nurse.avatar}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{nurse.name}</h4>
                  <p className="text-xs text-gray-500">NIP: {nurse.nip}</p>
                  <div className="mt-2 space-y-1 text-xs text-gray-600">
                    <p><i className="fas fa-briefcase-medical mr-1 w-4"></i>{nurse.role.replace('_', ' ')}</p>
                    <p><i className="fas fa-building mr-1 w-4"></i>Lantai {nurse.floor} • Shift {nurse.shift}</p>
                    <p><i className="fas fa-phone mr-1 w-4"></i>{nurse.phone}</p>
                    <p><i className="fas fa-envelope mr-1 w-4"></i>{nurse.email}</p>
                  </div>
                  <div className="mt-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      nurse.status === 'on_duty' ? 'bg-green-100 text-green-700' :
                      nurse.status === 'break' ? 'bg-yellow-100 text-yellow-700' :
                      nurse.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {nurse.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Tambah Akun Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Username</label>
                <input type="text" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Masukkan username" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Masukkan nama" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Masukkan email" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="admin">Admin</option>
                  <option value="operator">Operator</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input type="password" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Masukkan password" />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
