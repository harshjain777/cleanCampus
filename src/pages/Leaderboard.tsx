import React, { useEffect, useState } from 'react';
import { Trophy, Medal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface LeaderboardEntry {
  username: string;
  points: number;
}

const Leaderboard = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, points')
        .order('points', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLeaders(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Top Contributors</h1>
        <p className="mt-2 text-gray-600">Recognizing our most active campus cleaners</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ul role="list" className="divide-y divide-gray-200">
          {leaders.map((leader, index) => (
            <li
              key={leader.username}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {index < 3 ? (
                    <div className={`p-2 rounded-full ${
                      index === 0 ? 'bg-yellow-100' :
                      index === 1 ? 'bg-gray-100' :
                      'bg-orange-100'
                    }`}>
                      <Medal className={`h-6 w-6 ${
                        index === 0 ? 'text-yellow-600' :
                        index === 1 ? 'text-gray-600' :
                        'text-orange-600'
                      }`} />
                    </div>
                  ) : (
                    <span className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-50 text-gray-600 font-medium">
                      {index + 1}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">{leader.username}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">{leader.points}</span>
                <span className="text-sm text-gray-500">points</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;