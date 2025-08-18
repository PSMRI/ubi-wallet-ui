import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { vcApi } from '../services/api';
import { X, FileText, ArrowLeft } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

const VcDetails = ({ 
  vcId, 
  isOpen = false, 
  onClose = null, 
  showBackButton = false, 
  onBackClick = null,
  isPopup = false 
}) => {
  const [vc, setVc] = useState(null);
  const [vcName, setVcName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (vcId) {
      fetchVcDetails();
    }
  }, [vcId]);

  const fetchVcDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await vcApi.getVcById(user.accountId, vcId);
      const vcData = await JSON.parse(data?.data?.json);
      
      if (vcData?.credentialSchema?.title) {
        const title = vcData?.credentialSchema?.title?.split(':')?.[0] || '';
        setVcName(title || 'Verifiable Credential');
      }
      setVc(data?.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      );
    }

    if (!vc?.id) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">VC not found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-gray-100 rounded-md p-4">
          {vc.credentialSubject ? (
            <div className="space-y-3">
              {Object.entries(vc.credentialSubject).map(([key, value]) => {
                // Skip unwanted keys
                const skipKeys = ['start_date', 'end_date', 'id', '@context', 'originalvc', 'originalvc1', 'issueddate', 'recordvalidupto'];
                if (skipKeys.includes(key)) return null;

                // Skip if value is JSON object
                if (typeof value === 'object' && value !== null) {
                  return null;
                }

                let displayValue = value;
                
                // Check if value is a valid date string
                if (typeof value === 'string') {
                  const dateValue = new Date(value);
                  if (!isNaN(dateValue.getTime()) && value.length > 10) {
                    displayValue = formatDate(value);
                  }
                }

                return (
                  <div key={key} className="border-b border-gray-200 pb-3 last:border-b-0">
                    <label className="block text-sm font-medium text-gray-700 capitalize mb-2">
                      {key.replace(/([A-Z_])/g, ' $1').replace(/_/g, ' ').trim()}
                    </label>
                    <p className="text-sm text-navy break-all whitespace-pre-wrap leading-relaxed">
                      {displayValue}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No information available</p>
          )}
        </div>
      </div>
    );
  };

  const renderHeader = () => (
    <div className="flex items-center p-4 border-b border-gray-200">
      <div className="flex items-center flex-1">
        <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center mr-3">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-navy">
            {vcName || 'Verifiable Credential'}
          </h2>
          <p className="text-sm text-gray-600">Credential Details</p>
        </div>
      </div>
      {isPopup && onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  );

  // If it's a popup and not open, don't render
  if (isPopup && !isOpen) return null;

  // Popup mode
  if (isPopup) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {renderHeader()}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  // Full page mode
  return (
    <div className="page-bg min-h-screen py-4 px-4 sm:px-6 lg:px-8">
      {showBackButton && onBackClick && (
        <div className="mb-4 sm:mb-6">
          <button
            onClick={onBackClick}
            className="inline-flex items-center text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to VCs
          </button>
        </div>
      )}

      <div className="details-card">
        <div className="flex items-center p-4 sm:p-6">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-accent flex items-center justify-center">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div className="ml-3 sm:ml-4">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-navy">
              {vcName || 'Verifiable Credential'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Credential Details</p>
          </div>
        </div>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="bg-gray-100 rounded-md p-3 sm:p-4 lg:p-6">
                {vc?.credentialSubject ? (
                  <div className="space-y-3 sm:space-y-4">
                    {Object.entries(vc.credentialSubject).map(([key, value]) => {
                      // Skip unwanted keys
                      const skipKeys = ['start_date', 'end_date', 'id', '@context', 'originalvc', 'originalvc1', 'issueddate', 'recordvalidupto'];
                      if (skipKeys.includes(key)) return null;

                      // Skip if value is JSON object
                      if (typeof value === 'object' && value !== null) {
                        return null;
                      }

                      let displayValue = value;
                      
                      // Check if value is a valid date string
                      if (typeof value === 'string') {
                        const dateValue = new Date(value);
                        if (!isNaN(dateValue.getTime()) && value.length > 10) {
                          displayValue = formatDate(value);
                        }
                      }

                      return (
                        <div key={key} className="border-b border-gray-200 pb-3 sm:pb-4 last:border-b-0">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 capitalize mb-1 sm:mb-2">
                            {key.replace(/([A-Z_])/g, ' $1').replace(/_/g, ' ').trim()}
                          </label>
                          <p className="text-xs sm:text-sm text-navy break-all whitespace-pre-wrap leading-relaxed">
                            {displayValue}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No information available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VcDetails; 