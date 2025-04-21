import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Report {
  id: string;
  user_id: string;
  image_url: string;
  location: string;
  points_awarded: number;
  created_at: string;
  profiles: {
    username: string;
  };
}

const AdminDashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          profiles!fk_reports_user_id (username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-500">Manage and review waste reports</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Clock className="animate-spin h-8 w-8 text-green-600" />
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border rounded-xl shadow hover:shadow-md transition p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">
                  Reported by {report.profiles.username}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(report.created_at), 'PPp')}
                </p>
              </div>
              <p className="text-lg capitalize text-zinc-800 mb-3">loaction: {report.location}</p>
              <div className="aspect-w-16 aspect-h-9 mb-3">
              <img
  src={report.image_url}
  alt="Report"
  className="object-cover w-full h-full max-h-64 rounded-lg"
/>

              </div>
              <p className="text-xs text-gray-400">
                Points Awarded: {report.points_awarded}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
