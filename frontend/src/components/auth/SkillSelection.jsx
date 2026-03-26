import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AVAILABLE_SKILLS = [
  'Cleaning', 'Repair', 'Moving', 'Delivery', 'Tutoring',
  'Design', 'Writing', 'Tech Support', 'Photography', 'Cooking',
  'Gardening', 'Pet Care', 'Plumbing', 'Carpentry', 'Electrician',
  'Landscaping', 'Painting', 'HVAC', 'Translation', 'Consulting'
];

const SkillSelection = () => {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleContinue = async () => {
    if (selectedSkills.length === 0) {
      alert('Please select at least one skill');
      return;
    }

    setLoading(true);
    try {
      // Save skills to backend or context/localStorage
      localStorage.setItem('selectedSkills', JSON.stringify(selectedSkills));
      navigate('/onboarding/location');
    } catch (err) {
      console.error('Error saving skills:', err);
      alert('Failed to save skills');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/onboarding/role');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Select Your Skills</h1>
            <div className="text-sm text-gray-600">Step 2 of 4</div>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '33%' }}></div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-md">
          <p className="text-gray-700">
            Select all the skills you offer. You can add more skills later in your profile.
            Choose at least one skill to continue.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="bg-white rounded-lg p-8 shadow-md mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {AVAILABLE_SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`p-4 rounded-lg border-2 text-lg font-medium transition-all ${
                  selectedSkills.includes(skill)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                }`}
              >
                {skill}
                {selectedSkills.includes(skill) && ' ✓'}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Skills Summary */}
        {selectedSkills.length > 0 && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded">
            <p className="text-sm text-gray-600 mb-2">Selected Skills ({selectedSkills.length})</p>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={selectedSkills.length === 0 || loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillSelection;
