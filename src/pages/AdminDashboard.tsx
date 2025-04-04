import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Report {
  id: string;
  user_id: string;
  image_url: string;
  location: string;
  status: string;
  points_awarded: number;
  created_at: string;
  profiles: {
    username: string;
  };
}

const AdminDashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          profiles (username)
        `)
        .eq('status', filter)
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

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status: newStatus,
          points_awarded: newStatus === 'completed' ? 50 : 0
        })
        .eq('id', reportId);

      if (error) throw error;
      
      toast.success(`Report marked as ${newStatus}`);
      fetchReports();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update report status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-gray-500">Manage and review waste reports</p>
        </div>
        <div className="mt-4 md:mt-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Clock className="animate-spin h-8 w-8 text-green-600" />
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {reports.map((report) => (
              <li key={report.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Reported by {report.profiles.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(report.created_at), 'PPp')}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{report.location}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <img
                    src={report.image_url}
                    alt="Report"
                    className="h-48 w-full object-cover rounded-lg"
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  {filter === 'pending' && (
                    <>
                      <button
                        onClick={() => updateReportStatus(report.id, 'in_progress')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Mark In Progress
                      </button>
                      <button
                        onClick={() => updateReportStatus(report.id, 'rejected')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </>
                  )}
                  {filter === 'in_progress' && (
                    <button
                      onClick={() => updateReportStatus(report.id, 'completed')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;