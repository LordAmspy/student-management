import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GraduationCap } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useStudentStore } from '../store/studentStore';

export function SearchPage() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchResult, setSearchResult] = useState<Student | null>(null);
  const [error, setError] = useState('');
  const { students } = useStudentStore();

  const handleSearch = () => {
    if (phoneNumber.match(/^\d{12}$/)) {
      setError('');
      const student = students.find(s => s.phoneNumber === phoneNumber);
      
      if (student) {
        // Check if student should be marked as inactive based on inactiveOn date
        const today = new Date();
        const inactiveDate = student.inactiveOn ? new Date(student.inactiveOn) : null;
        
        if (inactiveDate && today >= inactiveDate && student.activityStatus === 'ACTIVE') {
          setSearchResult({
            ...student,
            activityStatus: 'INACTIVE',
            inactivityReason: 'Automatically marked inactive due to reaching scheduled end date'
          });
        } else {
          setSearchResult(student);
        }
      } else {
        setSearchResult(null);
        setError('No student found with this phone number');
      }
    } else {
      setError('Please enter a valid 12-digit phone number');
      setSearchResult(null);
    }
  };

  const calculateExpiresIn = (inactiveOn?: string) => {
    if (!inactiveOn) return null;
    
    const today = new Date();
    const inactiveDate = new Date(inactiveOn);
    const diffTime = inactiveDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    return `${diffDays} days`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo and Header */}
        <div className="flex flex-col items-center py-16">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center space-x-2 text-2xl font-bold text-indigo-600 hover:text-indigo-500"
          >
            <GraduationCap className="h-10 w-10" />
            <span>Student Portal</span>
          </button>
          
          {/* Search Section */}
          <div className="mt-8 w-full max-w-md">
            <div className="flex gap-2">
              <Input
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 12) {
                    setPhoneNumber(value);
                  }
                }}
                placeholder="Enter 12-digit phone number"
                className="flex-1"
                maxLength={12}
                pattern="\d*"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>

        {/* Results Section */}
        {searchResult && (
          <div className="mt-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6 max-w-2xl mx-auto">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {searchResult.name}
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {searchResult.phoneNumber}
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {searchResult.type}
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="space-y-2">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        searchResult.activityStatus === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {searchResult.activityStatus}
                    </span>
                    {searchResult.activityStatus === 'INACTIVE' && searchResult.inactivityReason && (
                      <p className="text-sm text-gray-600">
                        Reason: {searchResult.inactivityReason}
                      </p>
                    )}
                  </div>
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Date of Joining</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {new Date(searchResult.dateOfJoining).toLocaleDateString()}
                </dd>
              </div>
              {searchResult.inactiveOn && (
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Expires In</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {calculateExpiresIn(searchResult.inactiveOn)}
                  </dd>
                </div>
              )}
            </dl>

            {/* Support Message */}
            <div className="mt-6 p-4 rounded-lg bg-gray-50">
              {searchResult.activityStatus === 'ACTIVE' ? (
                <p className="text-blue-700">
                  For any queries, contact support at{' '}
                  <a href="tel:+1234567890" className="font-medium">
                    +91-628-199-4649
                  </a>
                </p>
              ) : (
                <p className="text-red-700">
                  Your account is currently inactive. Please contact your mentor for assistance at{' '}
                  <a href="tel:+1234567890" className="font-medium">
                    +91-628-199-4649
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}