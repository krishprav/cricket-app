import React from 'react';
import { FaTwitter, FaFacebook, FaWhatsapp, FaLink } from 'react-icons/fa';

const SocialShare = ({ matchData }) => {
  if (!matchData) return null;
  
  const shareTitle = `${matchData.teams} - Live Cricket Score`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  const shareOnWhatsapp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`, '_blank');
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <h3 className="text-md font-bold text-gray-800 dark:text-white mb-3">Share This Match</h3>
      
      <div className="flex space-x-3">
        <button 
          onClick={shareOnTwitter}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors"
          aria-label="Share on Twitter"
        >
          <FaTwitter className="text-lg" />
        </button>
        
        <button 
          onClick={shareOnFacebook}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          aria-label="Share on Facebook"
        >
          <FaFacebook className="text-lg" />
        </button>
        
        <button 
          onClick={shareOnWhatsapp}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
          aria-label="Share on WhatsApp"
        >
          <FaWhatsapp className="text-lg" />
        </button>
        
        <button 
          onClick={copyToClipboard}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Copy link"
        >
          <FaLink className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default SocialShare;