import React, { useState, useEffect } from 'react';
import { Search, List, Grid, Trash2, Edit2, Save, X, Upload, User } from 'lucide-react';

// Mock data for initial testing
const initialDignitaries = [
  {
    id: 1,
    name: "Jane Doe",
    designation: "Foreign Minister",
    organization: "Republic of Exampleland",
    status: "Started",
    remarks: "Arriving with delegation of 3",
    carNumber: "DL-01-AB-1234",
    loName: "Alex Johnson",
    loNumber: "+91-9876543210",
    facilitator: "Sarah Williams",
    image: null,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    name: "John Smith",
    designation: "Ambassador",
    organization: "United Nations",
    status: "Reaching in 5 min",
    remarks: "Will proceed directly to conference room",
    carNumber: "DL-02-CD-5678",
    loName: "Michael Brown",
    loNumber: "+91-8765432109",
    facilitator: "Robert Davis",
    image: null,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 minutes ago
  },
  {
    id: 3,
    name: "Maria Garcia",
    designation: "Secretary of State",
    organization: "Republic of Samplestan",
    status: "Not Started",
    remarks: "Awaiting flight confirmation",
    carNumber: "DL-03-EF-9012",
    loName: "Emily Wilson",
    loNumber: "+91-7654321098",
    facilitator: "Daniel Lee",
    image: null,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
  }
];

// Status options with their color mappings
const statusOptions = {
  "Reaching in 5 min": "bg-red-100 text-red-800 border-red-200",
  "Reaching in 10 min": "bg-orange-100 text-orange-800 border-orange-200",
  "Started": "bg-green-100 text-green-800 border-green-200",
  "Not Started": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Reached": "bg-blue-100 text-blue-800 border-blue-200"
};

const DignitaryTracker = () => {
  // State variables
  const [dignitaries, setDignitaries] = useState([]);
  const [view, setView] = useState('tile'); // 'tile' or 'list'
  const [filterText, setFilterText] = useState('');
  const [userRole, setUserRole] = useState('admin'); // 'admin' or 'lo'
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingInline, setEditingInline] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    organization: '',
    status: 'Not Started',
    remarks: '',
    carNumber: '',
    loName: '',
    loNumber: '',
    facilitator: '',
    image: null
  });

  // Initialize data
  useEffect(() => {
    // In a real app, this would be an API call
    setDignitaries(initialDignitaries);
  }, []);

  // Sort by status priority and then by last updated time
  const sortedDignitaries = [...dignitaries].sort((a, b) => {
    const statusPriority = {
      "Reaching in 5 min": 0,
      "Reaching in 10 min": 1,
      "Started": 2,
      "Not Started": 3,
      "Reached": 4
    };
    
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }
    
    // If statuses are the same, sort by lastUpdated (newest first)
    return new Date(b.lastUpdated) - new Date(a.lastUpdated);
  });

  // Filter dignitaries based on search text
  const filteredDignitaries = sortedDignitaries.filter(dignitary => {
    const searchText = filterText.toLowerCase();
    return (
      dignitary.name.toLowerCase().includes(searchText) ||
      dignitary.organization.toLowerCase().includes(searchText) ||
      dignitary.status.toLowerCase().includes(searchText)
    );
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new dignitary or update existing one
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    
    if (editingId) {
      // Update existing dignitary
      setDignitaries(dignitaries.map(d => 
        d.id === editingId ? 
          { ...d, ...formData, lastUpdated: now } : 
          d
      ));
      setEditingId(null);
    } else {
      // Add new dignitary
      const newDignitary = {
        ...formData,
        id: Date.now(), // Simple ID generation
        lastUpdated: now
      };
      setDignitaries([...dignitaries, newDignitary]);
    }
    
    // Reset form
    setFormData({
      name: '',
      designation: '',
      organization: '',
      status: 'Not Started',
      remarks: '',
      carNumber: '',
      loName: '',
      loNumber: '',
      facilitator: '',
      image: null
    });
    
    setFormVisible(false);
  };

  // Delete a dignitary
  const handleDelete = (id) => {
    if (userRole === 'admin' && window.confirm('Are you sure you want to delete this entry?')) {
      setDignitaries(dignitaries.filter(d => d.id !== id));
    }
  };

  // Edit a dignitary
  const handleEdit = (dignitary) => {
    setFormData({
      name: dignitary.name,
      designation: dignitary.designation,
      organization: dignitary.organization,
      status: dignitary.status,
      remarks: dignitary.remarks,
      carNumber: dignitary.carNumber || '',
      loName: dignitary.loName || '',
      loNumber: dignitary.loNumber || '',
      facilitator: dignitary.facilitator || '',
      image: dignitary.image
    });
    setEditingId(dignitary.id);
    setFormVisible(true);
  };

  // Start inline editing
  const startInlineEdit = (id) => {
    setEditingInline(id);
  };

  // Save inline edit
  const saveInlineEdit = (id, status, remarks) => {
    setDignitaries(dignitaries.map(d => 
      d.id === id ? 
        { ...d, status, remarks, lastUpdated: new Date().toISOString() } : 
        d
    ));
    setEditingInline(null);
  };

  // Format timestamp to readable format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dignitary Tracker</h1>
            <p className="text-gray-600">Track and manage dignitary arrivals in real-time</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Role selector */}
            <div className="bg-white shadow rounded-2xl p-2">
              <select 
                className="px-2 py-1 border-none focus:ring-0 focus:outline-none rounded-2xl"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
              >
                <option value="admin">Admin Access</option>
                <option value="lo">LO Access</option>
              </select>
            </div>
            
            {/* View toggle */}
            <div className="bg-white shadow rounded-2xl p-2 flex">
              <button 
                onClick={() => setView('tile')}
                className={`px-3 py-1 rounded-2xl ${view === 'tile' ? 'bg-blue-100 text-blue-800' : 'text-gray-500'}`}
              >
                <Grid size={18} className="inline mr-1" />
                <span className="hidden sm:inline">Tile</span>
              </button>
              <button 
                onClick={() => setView('list')}
                className={`px-3 py-1 rounded-2xl ${view === 'list' ? 'bg-blue-100 text-blue-800' : 'text-gray-500'}`}
              >
                <List size={18} className="inline mr-1" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white w-full pl-10 pr-4 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              placeholder="Search dignitaries..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          
          {/* Add New Button */}
          <button
            onClick={() => {
              setEditingId(null);
              setFormVisible(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-2xl shadow transition flex items-center"
          >
            <span className="mr-2">+</span> <span className="hidden sm:inline">Add Dignitary</span><span className="sm:hidden">Add</span>
          </button>
        </div>
        
        {/* Form Modal */}
        {formVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg mx-2 sm:mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingId ? 'Edit Dignitary' : 'Add New Dignitary'}
                </h2>
                <button 
                  onClick={() => setFormVisible(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mb-2">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User size={40} className="text-gray-400" />
                      )}
                    </div>
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-2xl text-sm flex items-center">
                      <Upload size={16} className="mr-1" />
                      Upload Image
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>
                  
                  {/* Designation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>
                  
                  {/* Organization */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>

                  {/* Car Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Number</label>
                    <input
                      type="text"
                      name="carNumber"
                      value={formData.carNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  {/* LO Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LO Name</label>
                    <input
                      type="text"
                      name="loName"
                      value={formData.loName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  {/* LO Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LO Number</label>
                    <input
                      type="text"
                      name="loNumber"
                      value={formData.loNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  {/* Facilitator */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facilitator</label>
                    <input
                      type="text"
                      name="facilitator"
                      value={formData.facilitator}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      {Object.keys(statusOptions).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Remarks */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    <textarea
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setFormVisible(false)}
                      className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
                    >
                      {editingId ? 'Save Changes' : 'Add Dignitary'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="bg-white shadow rounded-2xl p-4 md:p-6">
          {filteredDignitaries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No dignitaries found. Add one to get started!</p>
            </div>
          ) : (
            <>
              {/* Tile View */}
              {view === 'tile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDignitaries.map(dignitary => (
                    <div key={dignitary.id} className="border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow transition">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                            {dignitary.image ? (
                              <img src={dignitary.image} alt={dignitary.name} className="w-full h-full object-cover" />
                            ) : (
                              <User size={28} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{dignitary.name}</h3>
                            <p className="text-gray-600 text-sm">{dignitary.designation}</p>
                            <p className="text-gray-500 text-sm">{dignitary.organization}</p>
                            <p className="text-gray-500 text-xs mt-1">Car: {dignitary.carNumber || 'N/A'}</p>
                          </div>
                        </div>
                        
                        {userRole === 'admin' && (
                          <div className="flex flex-col space-y-2">
                            <button 
                              onClick={() => handleEdit(dignitary)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(dignitary.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        {editingInline === dignitary.id ? (
                          <div className="space-y-2">
                            <select
                              value={dignitary.status}
                              onChange={(e) => {
                                setDignitaries(dignitaries.map(d => 
                                  d.id === dignitary.id ? { ...d, status: e.target.value } : d
                                ));
                              }}
                              className="w-full p-1 text-sm border border-gray-300 rounded-2xl"
                            >
                              {Object.keys(statusOptions).map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                            
                            <textarea
                              value={dignitary.remarks}
                              onChange={(e) => {
                                setDignitaries(dignitaries.map(d => 
                                  d.id === dignitary.id ? { ...d, remarks: e.target.value } : d
                                ));
                              }}
                              className="w-full p-1 text-sm border border-gray-300 rounded-2xl"
                              rows="2"
                            ></textarea>
                            
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setEditingInline(null)}
                                className="text-gray-600 bg-gray-100 hover:bg-gray-200 p-1 rounded"
                              >
                                <X size={16} />
                              </button>
                              <button
                                onClick={() => saveInlineEdit(dignitary.id, dignitary.status, dignitary.remarks)}
                                className="text-white bg-blue-600 hover:bg-blue-700 p-1 rounded"
                              >
                                <Save size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div 
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${statusOptions[dignitary.status]}`}
                              onClick={() => userRole !== 'admin' && startInlineEdit(dignitary.id)}
                            >
                              {dignitary.status}
                            </div>
                            
                            <p className="text-gray-700 mt-2 text-sm">
                              {dignitary.remarks || "No remarks"}
                            </p>
                            
                            <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-gray-600">
                              <p><span className="font-medium">LO:</span> {dignitary.loName || 'N/A'} ({dignitary.loNumber || 'N/A'})</p>
                              <p><span className="font-medium">Facilitator:</span> {dignitary.facilitator || 'N/A'}</p>
                            </div>
                            
                            <p className="text-gray-400 text-xs mt-4">
                              Last updated: {formatTime(dignitary.lastUpdated)}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* List View */}
              {view === 'list' && (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          S.No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Designation
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Organization
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Car
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          LO Details
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Remarks
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredDignitaries.map((dignitary, index) => (
                        <tr key={dignitary.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 flex-shrink-0 mr-3">
                                {dignitary.image ? (
                                  <img className="h-8 w-8 rounded-full" src={dignitary.image} alt={dignitary.name} />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <User size={16} className="text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="font-medium text-gray-900">{dignitary.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {dignitary.designation}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {dignitary.organization}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {dignitary.carNumber || 'N/A'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="text-xs">
                              <p>LO: {dignitary.loName || 'N/A'}</p>
                              <p>#{dignitary.loNumber || 'N/A'}</p>
                              <p>Fac: {dignitary.facilitator || 'N/A'}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {editingInline === dignitary.id ? (
                              <select
                                value={dignitary.status}
                                onChange={(e) => {
                                  setDignitaries(dignitaries.map(d => 
                                    d.id === dignitary.id ? { ...d, status: e.target.value } : d
                                  ));
                                }}
                                className="w-full p-1 text-sm border border-gray-300 rounded-2xl"
                              >
                                {Object.keys(statusOptions).map(status => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                            ) : (
                              <span 
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusOptions[dignitary.status]}`}
                                onClick={() => startInlineEdit(dignitary.id)}
                              >
                                {dignitary.status}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {editingInline === dignitary.id ? (
                              <textarea
                                value={dignitary.remarks}
                                onChange={(e) => {
                                  setDignitaries(dignitaries.map(d => 
                                    d.id === dignitary.id ? { ...d, remarks: e.target.value } : d
                                  ));
                                }}
                                className="w-full p-1 text-sm border border-gray-300 rounded-lg"
                                rows="2"
                              ></textarea>
                            ) : (
                              <span 
                                className="cursor-pointer"
                                onClick={() => startInlineEdit(dignitary.id)}
                              >
                                {dignitary.remarks || "No remarks"}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatTime(dignitary.lastUpdated)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {editingInline === dignitary.id ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingInline(null)}
                                  className="text-gray-600 hover:text-gray-800"
                                >
                                  <X size={16} />
                                </button>
                                <button
                                  onClick={() => saveInlineEdit(dignitary.id, dignitary.status, dignitary.remarks)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Save size={16} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleEdit(dignitary)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Edit2 size={16} />
                                </button>
                                {userRole === 'admin' && (
                                  <button 
                                    onClick={() => handleDelete(dignitary.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DignitaryTracker;