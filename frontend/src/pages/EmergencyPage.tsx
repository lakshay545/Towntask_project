import { useState, useEffect } from 'react';
import { emergencyApi } from '../services/api';
import { buildMyEmergenciesRoute } from '../router/routes';
import { AlertTriangle, Phone, Shield, Car, Heart, HelpCircle, Clock, MapPin, Loader2, CheckCircle, AlertCircle, Zap } from 'lucide-react';

const HIGH_CATEGORIES = [
  { id: 'crime', label: 'Crime', icon: Shield, color: 'text-red-600' },
  { id: 'medical', label: 'Medical Emergency', icon: Heart, color: 'text-pink-600' },
  { id: 'personal_safety', label: 'Personal Safety', icon: AlertTriangle, color: 'text-orange-600' },
  { id: 'vehicle_breakdown', label: 'Vehicle Breakdown', icon: Car, color: 'text-blue-600' },
  { id: 'civil_help', label: 'Civil Help', icon: HelpCircle, color: 'text-green-600' },
  { id: 'other', label: 'Other', icon: AlertCircle, color: 'text-gray-600' },
];

const LIGHT_CATEGORIES = [
  { id: 'tutor', label: 'Tutor', icon: HelpCircle },
  { id: 'plumber', label: 'Plumber', icon: HelpCircle },
  { id: 'electrician', label: 'Electrician', icon: Zap },
  { id: 'mechanic', label: 'Mechanic', icon: Car },
  { id: 'doctor', label: 'Doctor', icon: Heart },
  { id: 'general_service', label: 'General Service', icon: HelpCircle },
];

const URGENCY_LEVELS = [
  { id: 'normal', label: 'Normal', desc: 'Within a few days', color: 'border-green-500 bg-green-50' },
  { id: 'urgent', label: 'Urgent (24h)', desc: 'Need within 24 hours', color: 'border-orange-500 bg-orange-50' },
  { id: 'immediate', label: 'Immediate (2-4h)', desc: 'Need within 2-4 hours', color: 'border-red-500 bg-red-50' },
];

export default function EmergencyPage() {
  const [tab, setTab] = useState<'high' | 'light'>('high');
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('normal');
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Auto-fetch location
  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    setLocationLoading(true);
    setLocationError('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationLoading(false);
        },
        (err) => {
          setLocationError('Location access denied. Please enable location for emergencies.');
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationError('Geolocation not supported by your browser.');
      setLocationLoading(false);
    }
  };

  const handleSubmitHigh = async () => {
    if (!location) { setError('Location is required for high emergency.'); return; }
    if (!category) { setError('Please select a category.'); return; }
    if (!description || description.length < 10) { setError('Please describe the situation (min 10 chars).'); return; }
    if (!disclaimerAccepted) { setError('You must accept the disclaimer.'); return; }

    setSubmitting(true);
    setError('');
    try {
      const res = await emergencyApi.createHighEmergency({
        category,
        description,
        lat: location.lat,
        lng: location.lng,
        disclaimerAccepted,
      });
      setResult(res);
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Failed to post emergency');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitLight = async () => {
    if (!category) { setError('Please select a category.'); return; }
    if (!description || description.length < 10) { setError('Please describe your need (min 10 chars).'); return; }

    setSubmitting(true);
    setError('');
    try {
      const res = await emergencyApi.createLightEmergency({
        category,
        description,
        lat: location?.lat,
        lng: location?.lng,
        urgencyLevel,
      });
      setResult(res);
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Failed to post request');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCategory('');
    setDescription('');
    setUrgencyLevel('normal');
    setDisclaimerAccepted(false);
    setResult(null);
    setError('');
  };

  // Success screen
  if (step === 4 && result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4">
        <div className="max-w-lg mx-auto mt-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {tab === 'high' ? 'Emergency Posted!' : 'Request Submitted!'}
            </h2>
            <p className="text-gray-600 mb-4">{result.message}</p>
            {tab === 'high' && result.notifiedVolunteers !== undefined && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-blue-800 font-medium">
                  {result.notifiedVolunteers} volunteers notified nearby
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Radius will auto-expand if no one responds within 3 minutes.
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                New Request
              </button>
              <button
                onClick={() => { window.location.hash = buildMyEmergenciesRoute(); }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View My Emergencies
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Emergency & Priority Help</h1>
          <p className="text-red-100">Get immediate help from verified community volunteers</p>
        </div>
      </div>

      {/* Tab selector */}
      <div className="max-w-2xl mx-auto px-4 -mt-4">
        <div className="bg-white rounded-xl shadow-lg flex overflow-hidden">
          <button
            onClick={() => { setTab('high'); resetForm(); }}
            className={`flex-1 py-4 px-4 text-center font-semibold transition-colors ${
              tab === 'high'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-600 hover:bg-red-50'
            }`}
          >
            <AlertTriangle className="w-5 h-5 inline-block mr-2 mb-0.5" />
            High Emergency (SOS)
          </button>
          <button
            onClick={() => { setTab('light'); resetForm(); }}
            className={`flex-1 py-4 px-4 text-center font-semibold transition-colors ${
              tab === 'light'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 hover:bg-orange-50'
            }`}
          >
            <Clock className="w-5 h-5 inline-block mr-2 mb-0.5" />
            Light Emergency
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* HIGH EMERGENCY FLOW */}
        {tab === 'high' && (
          <div>
            {/* Disclaimer Banner */}
            <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-yellow-800 font-medium text-sm">
                    This app does NOT replace official emergency services
                  </p>
                  <p className="text-yellow-700 text-xs mt-1">
                    Police: 100 | Ambulance: 108 | Fire: 101 | Women Helpline: 1091
                  </p>
                </div>
              </div>
            </div>

            {/* Step 1: Category */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">What's the emergency?</h2>
                <div className="grid grid-cols-2 gap-3">
                  {HIGH_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setCategory(cat.id); setStep(2); }}
                        className={`p-4 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                          category === cat.id
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        <Icon className={`w-8 h-8 ${cat.color} mb-2`} />
                        <span className="font-medium text-gray-900">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Description + Location */}
            {step === 2 && (
              <div>
                <button onClick={() => setStep(1)} className="text-sm text-blue-600 mb-4 hover:underline">
                  ← Change category
                </button>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Describe the situation</h2>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what's happening... (minimum 10 characters)"
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1">{description.length}/500</p>

                {/* Location */}
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <span className="font-medium text-gray-700">Your Location</span>
                  </div>
                  {locationLoading ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Fetching location...</span>
                    </div>
                  ) : location ? (
                    <p className="text-sm text-green-600">
                      Location acquired ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                    </p>
                  ) : (
                    <div>
                      <p className="text-sm text-red-500">{locationError}</p>
                      <button onClick={fetchLocation} className="text-sm text-blue-600 hover:underline mt-1">
                        Retry location
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setStep(3)}
                  disabled={!description || description.length < 10 || !location}
                  className="w-full mt-4 py-3 bg-red-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div>
                <button onClick={() => setStep(2)} className="text-sm text-blue-600 mb-4 hover:underline">
                  ← Edit description
                </button>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Emergency</h2>

                <div className="bg-white border-2 border-red-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">Category:</span>
                    <span className="font-medium capitalize">{category.replace('_', ' ')}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-500">Description:</span>
                    <p className="text-gray-900 mt-1">{description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">
                      {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Disclaimer checkbox */}
                <label className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={disclaimerAccepted}
                    onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 text-red-600 rounded"
                  />
                  <span className="text-sm text-yellow-800">
                    I understand this platform connects community members for voluntary assistance.
                    It does NOT replace Police (100), Ambulance (108), or Fire Services (101).
                    I confirm this is a genuine emergency.
                  </span>
                </label>

                {error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmitHigh}
                  disabled={submitting || !disclaimerAccepted}
                  className="w-full mt-4 py-4 bg-red-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Posting...</>
                  ) : (
                    <><AlertTriangle className="w-5 h-5" /> SEND SOS ALERT</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* LIGHT EMERGENCY FLOW */}
        {tab === 'light' && (
          <div>
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">What service do you need urgently?</h2>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {LIGHT_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setCategory(cat.id); }}
                        className={`p-4 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                          category === cat.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <Icon className="w-6 h-6 text-orange-500 mb-2" />
                        <span className="font-medium text-gray-900">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {category && (
                  <>
                    <h3 className="font-semibold text-gray-800 mb-3">How urgent is this?</h3>
                    <div className="space-y-2 mb-6">
                      {URGENCY_LEVELS.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => setUrgencyLevel(level.id)}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            urgencyLevel === level.id ? level.color : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="font-medium text-gray-900">{level.label}</span>
                          <p className="text-sm text-gray-500">{level.desc}</p>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600"
                    >
                      Continue
                    </button>
                  </>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <button onClick={() => setStep(1)} className="text-sm text-blue-600 mb-4 hover:underline">
                  ← Change category
                </button>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Describe what you need</h2>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your requirement... (e.g., Need a plumber for pipe leak in kitchen)"
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1">{description.length}/500</p>

                {/* Location (optional for light) */}
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <span className="font-medium text-gray-700">Your Location (Optional)</span>
                  </div>
                  {location ? (
                    <p className="text-sm text-green-600">
                      ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                    </p>
                  ) : (
                    <button onClick={fetchLocation} className="text-sm text-blue-600 hover:underline">
                      {locationLoading ? 'Fetching...' : 'Add location'}
                    </button>
                  )}
                </div>

                {error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmitLight}
                  disabled={submitting || !description || description.length < 10}
                  className="w-full mt-4 py-3 bg-orange-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-orange-600 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Posting...</>
                  ) : (
                    <><Zap className="w-5 h-5" /> Post Priority Request</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
