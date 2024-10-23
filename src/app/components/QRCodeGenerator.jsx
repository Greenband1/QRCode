"use client";

import React, { useState, useEffect } from 'react';
import { Wifi, Link as LinkIcon, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import QRCode from 'react-qr-code';

const QRCodeGenerator = () => {
  const [mounted, setMounted] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [errors, setErrors] = useState({
    ssid: '',
    password: '',
    url: ''
  });
  const [state, setState] = useState({
    inputType: 'wifi',
    ssid: '',
    password: '',
    url: '',
    resolution: 'medium',
    showText: false,
    showPassword: true
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {
      ssid: '',
      password: '',
      url: ''
    };

    if (state.inputType === 'wifi') {
      if (!state.ssid.trim()) {
        newErrors.ssid = 'SSID is required';
        isValid = false;
      }
      if (!state.password.trim()) {
        newErrors.password = 'Password is required';
        isValid = false;
      } else if (state.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
        isValid = false;
      }
    } else {
      if (!state.url.trim()) {
        newErrors.url = 'URL is required';
        isValid = false;
      } else {
        try {
          new URL(state.url);
        } catch (e) {
          newErrors.url = 'Please enter a valid URL';
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (name, value) => {
    setState(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getQRSize = () => {
    switch (state.resolution) {
      case 'low': return 128;
      case 'medium': return 256;
      case 'high': return 512;
      default: return 256;
    }
  };

  const getQRData = () => {
    if (state.inputType === 'wifi') {
      return `WIFI:S:${state.ssid};T:WPA;P:${state.password};;`;
    }
    return state.url;
  };

  const generateQRCode = () => {
    if (validateInputs()) {
      setShowQRCode(true);
    }
  };

  const handleReturn = () => {
    setShowQRCode(false);
  };

  const downloadQRCode = () => {
    const svg = document.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = getQRSize();
      canvas.height = getQRSize();
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = pngUrl;
      link.click();
    };

    img.src = url;
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      {showQRCode ? (
        <div className="max-w-md mx-auto space-y-6">
          <button 
            onClick={handleReturn}
            className="flex items-center text-blue-700 hover:text-blue-900 mb-4 text-base font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Return to Generator
          </button>
          
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your QR Code</h2>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <QRCode
                value={getQRData()}
                size={getQRSize()}
                level="H"
                className="mx-auto"
              />
              
              {state.showText && (
                <div className="mt-4 text-base text-gray-900">
                  {state.inputType === 'wifi' ? (
                    <>
                      <p className="font-medium">SSID: {state.ssid}</p>
                      <p className="font-medium">Password: {state.password}</p>
                    </>
                  ) : (
                    <p className="font-medium">URL: {state.url}</p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={downloadQRCode}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
            >
              Download QR Code
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">QR Code Generator</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">Input Type</label>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 text-gray-900">
                  <input
                    type="radio"
                    checked={state.inputType === 'wifi'}
                    onChange={() => handleInputChange('inputType', 'wifi')}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="text-base">WiFi</span>
                  <Wifi size={18} />
                </label>
                <label className="flex items-center space-x-2 text-gray-900">
                  <input
                    type="radio"
                    checked={state.inputType === 'url'}
                    onChange={() => handleInputChange('inputType', 'url')}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="text-base">URL</span>
                  <LinkIcon size={18} />
                </label>
              </div>
            </div>

            {state.inputType === 'wifi' ? (
              <>
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-2">
                    SSID
                  </label>
                  <input
                    type="text"
                    value={state.ssid}
                    onChange={(e) => handleInputChange('ssid', e.target.value)}
                    placeholder="Enter WiFi name"
                    className={`w-full px-3 py-2 border rounded-lg text-gray-900 text-base ${
                      errors.ssid ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.ssid && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">{errors.ssid}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="flex">
                    <input
                      type={state.showPassword ? "text" : "password"}
                      value={state.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter WiFi password"
                      className={`w-full px-3 py-2 border rounded-l-lg text-gray-900 text-base ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      onClick={() => handleInputChange('showPassword', !state.showPassword)}
                      className="px-3 py-2 border border-l-0 rounded-r-lg bg-white text-gray-600 hover:bg-gray-50"
                    >
                      {state.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">{errors.password}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div>
                <label className="block text-base font-medium text-gray-900 mb-2">URL</label>
                <input
                  type="text"
                  value={state.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="Enter URL (e.g., https://example.com)"
                  className={`w-full px-3 py-2 border rounded-lg text-gray-900 text-base ${
                    errors.url ? 'border-red-500' : ''
                  }`}
                />
                {errors.url && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">{errors.url}</span>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">Resolution</label>
              <div className="flex space-x-6">
                {['low', 'medium', 'high'].map((res) => (
                  <label key={res} className="flex items-center space-x-2 text-gray-900">
                    <input
                      type="radio"
                      checked={state.resolution === res}
                      onChange={() => handleInputChange('resolution', res)}
                      className="form-radio text-blue-600 h-4 w-4"
                    />
                    <span className="capitalize text-base">{res}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={state.showText}
                onChange={(e) => handleInputChange('showText', e.target.checked)}
                className="form-checkbox text-blue-600 h-4 w-4"
              />
              <label className="text-base text-gray-900">Show text under QR code</label>
            </div>

            <button
              onClick={generateQRCode}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
            >
              Generate QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;