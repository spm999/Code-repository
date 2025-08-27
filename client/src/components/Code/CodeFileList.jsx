import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { codeAPI } from '../../api/api';

const CodeFileList = () => {
  const [codeFiles, setCodeFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCodeFiles();
  }, []);

  const fetchCodeFiles = async () => {
    try {
      const response = await codeAPI.getCodeFiles();
      if (response.success) {
        setCodeFiles(response.data);
      }
    } catch (error) {
      setError('Failed to fetch code files');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading code files...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Code Files</h2>
        <Link
          to="/code/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create New
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {codeFiles.map((file) => (
          <div key={file._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{file.title}</h3>
            <p className="text-gray-600 mb-4">{file.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                {file.language}
              </span>
              <span className={`text-sm px-2 py-1 rounded ${
                file.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                file.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {file.approvalStatus}
              </span>
            </div>

            <div className="flex space-x-2 mb-4">
              {file.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>

            <Link
              to={`/code/${file._id}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>

      {codeFiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No code files yet. Create your first one!</p>
        </div>
      )}
    </div>
  );
};

export default CodeFileList;