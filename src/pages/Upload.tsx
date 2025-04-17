import React, { useEffect, useState } from 'react';
import { Camera, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Upload = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    formData.append('api_key', '439747641958291');
    formData.append('cloud_name', 'dgsosqpa0');
    formData.append('timestamp', String(Date.now()));

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dgsosqpa0/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      toast.error('Please provide a location description');
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to submit reports');
        return navigate('/login');
      }

      let imageUrl = null;
      if (image) {
        imageUrl = await uploadToCloudinary(image);
      }
        
      const { error: reportError } = await supabase
      .from('reports')
      .insert([{
        image_url: imageUrl || '',
        location,
        points_awarded: 10,
        user_id: user.id
      }]);

      if (reportError) throw reportError;

      toast.success('Report submitted successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate('/login');
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Report Waste Location</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {preview ? (
                <div className="space-y-2">
                  <img src={preview} alt="Preview" className="max-h-64 rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreview('');
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location Description*
            </label>
            <textarea
              id="location"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              placeholder="Describe the location (e.g., 'Near Science Building entrance', 'Behind Library')"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Submitting...
              </span>
            ) : (
              'Submit Report'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;