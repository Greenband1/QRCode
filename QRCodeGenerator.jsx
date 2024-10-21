import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Wifi, Link, Eye, EyeOff } from 'lucide-react';

const QRCodeGenerator = () => {
  const [inputType, setInputType] = useState('wifi');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [resolution, setResolution] = useState('medium');
  const [showText, setShowText] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const generateQRCode = () => {
    let data = '';
    if (inputType === 'wifi') {
      data = `WIFI:S:${ssid};T:WPA;P:${password};;`;
    } else {
      data = url;
    }

    const size = resolution === 'low' ? 100 : resolution === 'medium' ? 200 : 300;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;

    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Input Type</Label>
          <RadioGroup defaultValue="wifi" onValueChange={setInputType} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wifi" id="wifi" />
              <Label htmlFor="wifi" className="flex items-center space-x-2">
                <span>WiFi</span>
                <Wifi size={16} />
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="url" id="url" />
              <Label htmlFor="url" className="flex items-center space-x-2">
                <span>URL</span>
                <Link size={16} />
              </Label>
            </div>
          </RadioGroup>
        </div>

        {inputType === 'wifi' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="ssid">SSID</Label>
              <Input id="ssid" value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="Enter WiFi name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter WiFi password"
                  className="rounded-r-none"
                />
                <Button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="rounded-l-none"
                  variant="outline"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter URL" />
          </div>
        )}

        <div className="space-y-2">
          <Label>Resolution</Label>
          <RadioGroup defaultValue="medium" onValueChange={setResolution} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high">High</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="show-text" checked={showText} onCheckedChange={setShowText} />
          <Label htmlFor="show-text">Show text under QR code</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={generateQRCode} className="w-full">Generate and Download QR Code</Button>
      </CardFooter>
    </Card>
  );
};

export default QRCodeGenerator;
