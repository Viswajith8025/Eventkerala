import React, { useState } from 'react';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ImageUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // LOW-02: Client-side file size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    // Show local preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload to our backend -> Cloudinary
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      setSuccess(false);
      
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onUploadSuccess(response.data.url);
        setSuccess(true);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setSuccess(false);
    onUploadSuccess('');
  };

  return (
    <div className="space-y-4">
      <div 
        className={`relative group h-64 w-full rounded-[2rem] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 overflow-hidden ${
          preview ? 'border-emerald-900 bg-white' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-emerald-700'
        }`}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all"></div>
            
            <button 
              type="button"
              onClick={removeImage}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-xl text-red-500 shadow-xl hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
            >
              <X className="w-5 h-5" />
            </button>

            {uploading ? (
              <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                <span className="font-bold text-sm">Uploading...</span>
              </div>
            ) : success ? (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-500 text-white rounded-full flex items-center gap-2 text-xs font-bold shadow-xl animate-in zoom-in slide-in-from-bottom duration-300">
                <CheckCircle className="w-4 h-4" />
                Ready to publish
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="p-4 bg-white rounded-2xl shadow-lg shadow-gray-200 mb-4 text-emerald-900 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-gray-900 mb-1">Upload Event Image</p>
              <p className="text-xs text-gray-400 font-medium">Recommended: 1600 x 900 px (Max 5MB)</p>
            </div>
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/*"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
