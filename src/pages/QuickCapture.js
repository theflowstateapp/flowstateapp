import React from 'react';

const QuickCapture = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Quick Capture
          </h1>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 mb-4">
              Capture your thoughts, tasks, and ideas quickly and efficiently.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">📝 Task</h3>
                <p className="text-sm text-gray-600">Capture a new task</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">📋 Project</h3>
                <p className="text-sm text-gray-600">Start a new project</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">📄 Note</h3>
                <p className="text-sm text-gray-600">Take a quick note</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">👥 Contact</h3>
                <p className="text-sm text-gray-600">Add a contact</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">🎯 Goal</h3>
                <p className="text-sm text-gray-600">Set a new goal</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">📚 Reference</h3>
                <p className="text-sm text-gray-600">Save a reference</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                💡 <strong>Tip:</strong> Use the global capture input in the top bar for quick access to capture functionality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickCapture;