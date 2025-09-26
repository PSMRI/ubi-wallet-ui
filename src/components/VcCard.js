import React from 'react';
import PropTypes from 'prop-types';
import { FileText, Calendar, CalendarDays, User, Eye, CheckSquare, Square } from 'lucide-react';

const VcCard = ({ 
  vc, 
  mode = 'view', // 'view' for VcList, 'select' for fetchVcs
  isSelected = false,
  onCardClick,
  onSelectionChange,
  onPreviewClick,
  formatDate,
  isExpired 
}) => {
  const handleCardClick = (e) => {
    if (mode === 'select') {
      // In select mode, clicking the card toggles selection
      onSelectionChange?.(vc.id);
    } else {
      // In view mode, clicking the card navigates to details
      onCardClick?.(vc.id);
    }
  };

  const handleSelectionClick = (e) => {
    e.stopPropagation();
    onSelectionChange?.(vc.id);
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    onPreviewClick?.(vc.id);
  };

  const getCardClasses = () => {
    const baseClasses = "card transition-all duration-200 cursor-pointer group";
    if (mode === 'select') {
      return `${baseClasses} ${
        isSelected 
          ? 'border-accent shadow-md ring-2 ring-accent/20' 
          : 'hover:shadow-md'
      }`;
    }
    return `${baseClasses} hover:shadow-md`;
  };

  const renderHeader = () => {
    if (mode === 'select') {
      return (
        <div className="flex items-center justify-between flex-1">
          <div className="flex items-center flex-1">
            <button
              onClick={handleSelectionClick}
              className="mr-3 mt-1"
            >
              {isSelected ? (
                <CheckSquare className="h-5 w-5 text-primary-600" />
              ) : (
                <Square className="h-5 w-5 text-gray-400 group-hover:text-primary-400" />
              )}
            </button>
            <div className="flex-1">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                  {vc.name || 'Unnamed Credential'}
                </h3>
              </div>
            </div>
          </div>
          <button
            onClick={handlePreviewClick}
            className="text-gray-400 hover:text-primary-600 transition-colors p-1"
            title="Preview Credential"
            aria-label="Preview credential"
          >
            <Eye className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {vc.name || 'Unnamed Credential'}
            </h3>
          </div>
        </div>
        <Eye className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
      </>
    );
  };

  return (
    <div
      className={getCardClasses()}
      onClick={handleCardClick}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          {renderHeader()}
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium">Issued:</span>
            <span className="ml-1">{formatDate(vc.issuedAt)}</span>
          </div>

          <div className="flex items-center text-sm">
            <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium text-gray-600">Expires:</span>
            <span className={`ml-1 ${isExpired(vc.expiresAt) ? 'text-red-600' : 'text-gray-600'}`}>
              {formatDate(vc.expiresAt)}
            </span>
            {isExpired(vc.expiresAt) && (
              <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                Expired
              </span>
            )}
          </div>

          {vc.issuer && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              <span className="font-medium">Issuer:</span>
              <span className="ml-1 truncate">{vc.issuer}</span>
            </div>
          )}

          {vc.status && (
            <div className="flex items-center">
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                vc.status === 'active' ? 'bg-green-100 text-green-800' :
                vc.status === 'expired' ? 'bg-red-100 text-red-800' :
                vc.status === 'revoked' ? 'bg-gray-100 text-gray-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {vc.status.charAt(0).toUpperCase() + vc.status.slice(1)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

VcCard.propTypes = {
  vc: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['view', 'select']),
  isSelected: PropTypes.bool,
  onCardClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onPreviewClick: PropTypes.func,
  formatDate: PropTypes.func.isRequired,
  isExpired: PropTypes.func.isRequired,
};

export default VcCard; 