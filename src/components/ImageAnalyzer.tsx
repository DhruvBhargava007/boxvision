import { useState, useRef } from 'react';
import ReactWebcam from 'react-webcam';
import { analyzeImage } from '../services/openai';
import './ImageAnalyzer.css';

const ImageAnalyzer = () => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');
  const webcamRef = useRef<ReactWebcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImage(imageSrc);
        setDescription('');
        setError('');
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setDescription('');
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!image) {
      setError('Please capture or upload an image first');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    
    try {
      const result = await analyzeImage(image);
      setDescription(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="analyzer-container">
      <h1 className="title">Image Analyzer</h1>
      
      <div className="section">
        <div className="webcam-container">
          <ReactWebcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam"
          />
          <button onClick={captureImage} className="button">
            Capture Image
          </button>
        </div>
      </div>

      <div className="section">
        <div className="upload-container">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="button"
          >
            Upload Image
          </button>
        </div>
      </div>

      {image && (
        <div className="section">
          <div className="preview-container">
            <img src={image} alt="Captured or uploaded image" className="preview-image" />
            <button
              onClick={handleAnalyzeImage}
              disabled={isAnalyzing}
              className="button"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {description && (
        <div className="description-container">
          <h2>Description:</h2>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer; 