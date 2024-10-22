"use client";

import React, { useState, useEffect } from 'react';
import { Wifi, Link as LinkIcon, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const QRCodeGenerator = () => {
  const [mounted, setMounted] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
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

  const handleInputChange = (name, value) => {
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateQRCode = () => {
    let data = '';
    if (state.inputType === 'wifi') {
      data = `WIFI:S:${state.ssid};T:WPA;P:${state.password};;`;
    } else {
      data = state.url;
    }

    const size = state.resolution === 'low' ? 100 : state.resolution === 'medium' ? 200 : 300;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
    setQrCodeUrl(qrUrl);
    setShowQRCode(true);
  };

  const handleReturn = () => {
    setShowQRCode(false);
    setQrCodeUrl('');
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
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
                  <label className="block text-base font-medium text-gray-900 mb-2">SSID</label>
                  <input
                    type="text"
                    value={state.ssid}
                    onChange={(e) => handleInputChange('ssid', e.target.value)}
                    placeholder="Enter WiFi name"
                    className="w-full px-3 py-2 border rounded-lg text-gray-900 text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-2">Password</label>
                  <div className="flex">
                    <input
                      type={state.showPassword ? "text" : "password"}
                      value={state.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter WiFi password"
                      className="w-full px-3 py-2 border rounded-l-lg text-gray-900 text-base"
                    />
                    <button
                      onClick={() => handleInputChange('showPassword', !state.showPassword)}
                      className="px-3 py-2 border border-l-0 rounded-r-lg bg-white text-gray-600 hover:bg-gray-50"
                    >
                      {state.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-base font-medium text-gray-900 mb-2">URL</label>
                <input
                  type="text"
                  value={state.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="Enter URL"
                  className="w-full px-3 py-2 border rounded-lg text-gray-900 text-base"
                />
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