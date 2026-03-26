import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(localStorage.getItem('selectedRole') || 'worker');
  const [formData, setFormData] = useState({
    bio: '',
    porfolioUrl: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleComplete = async () => {
    if (!formData.agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      // Save profile data
      const profileData = {
        bio: formData.bio,
        portfolioUrl: formData.porfolioUrl,
        selectedSkills: JSON.parse(localStorage.getItem('selectedSkills') || '[]'),
        location: JSON.parse(localStorage.getItem('location') || '{}')
      };

      console.log('Profile data to save:', profileData);
      
      // TODO: Make API call to save all onboarding data to backend
      // For now, save to localStorage
      localStorage.setItem('profileData', JSON.stringify(profileData));

      // Clear onboarding data from localStorage
      localStorage.removeItem('selectedRole');
      localStorage.removeItem('selectedSkills');
      localStorage.removeItem('location');

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error completing setup:', err);
      alert('Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/onboarding/location');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
            <div className="text-sm text-gray-600">Step 4 of 4</div>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg p-8 shadow-md mb-8">
          {/* Role-specific Introduction */}
          {selectedRole === 'worker' && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded">
              <h3 className="font-semibold text-gray-800 mb-2">Welcome, Worker! 👋</h3>
              <p className="text-sm text-gray-700">
                A good profile helps you stand out and get more job opportunities. Let clients know about your experience and expertise.
              </p>
            </div>
          )}

          {selectedRole === 'poster' && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
              <h3 className="font-semibold text-gray-800 mb-2">Welcome, Poster! 👋</h3>
              <p className="text-sm text-gray-700">
                Your profile helps workers understand your posting style and what kind of tasks you need done.
              </p>
            </div>
          )}

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              About You {selectedRole === 'worker' ? '(Bio)' : '(Company/Personal Profile)'}
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder={
                selectedRole === 'worker'
                  ? 'Tell clients about your experience, skills, and what makes you great at what you do...'
                  : 'Tell workers about yourself, your company, and what kind of tasks you post...'
              }
              rows="5"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Portfolio URL (for workers) */}
          {selectedRole === 'worker' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Portfolio URL (Optional)
              </label>
              <input
                type="url"
                name="porfolioUrl"
                value={formData.porfolioUrl}
                onChange={handleInputChange}
                placeholder="https://yourportfolio.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Link to your portfolio, GitHub, or work samples
              </p>
            </div>
          )}

          {/* Terms Agreement */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-1 mr-3 w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          {/* Profile Completion Summary */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
            <p className="text-sm text-gray-700 font-semibold mb-2">Profile Completion:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                <span className="text-green-500">✓</span> Role selected
              </li>
              <li>
                <span className="text-green-500">✓</span> {selectedRole === 'worker' ? 'Skills' : 'Profile'} added
              </li>
              <li>
                <span className="text-green-500">✓</span> Location verified
              </li>
              <li className={formData.bio ? 'text-green-500' : ''}>
                <span>{formData.bio ? '✓' : '○'}</span> Bio added
              </li>
            </ul>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition"
          >
            Back
          </button>
          <button
            onClick={handleComplete}
            disabled={!formData.agreeTerms || loading}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Completing...' : 'Complete Setup'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
