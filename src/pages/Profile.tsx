import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Award, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Profile {
  username: string;
  points: number;
}

interface Report {
  id: string;
  image_url: string;
  location: string;
  status: string;
  points_awarded: number;
  created_at: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to view your profile');
        return;
      }

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, points')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch user's reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;
      setReports(reportsData);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Clock className="animate-spin h-8 w-8 text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4">
              <Award className="h-12 w-12 text-green-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.username}</h2>
                <p className="text-gray-500">Member</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 font-medium">Total Points</p>
                <p className="text-3xl font-bold text-green-700">{profile.points}</p>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Reports</h3>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200">
                  {reports.map((report) => (
                    <li key={report.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={report.image_url}
                            alt="Report"
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {report.location}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(report.created_at), 'PPp')}
                          </p>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              report.status === 'completed' ? 'bg-green-100 text-green-800' :
                              report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                              report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {report.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-sm font-medium text-green-600">
                            +{report.points_awarded} points
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;