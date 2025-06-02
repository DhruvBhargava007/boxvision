import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import styled from '@emotion/styled';
import Webcam from 'react-webcam';
import { analyzeImage as analyzeImageAPI, initializeOpenAI } from '../services/openai';

interface FormData {
  palletId: string;
  timestamp: string;
  description: string;
  actionTaken: string;
  escalatedTo: string;
  additionalNotes: string;
  image?: File;
}

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  background-color: #4169e1;
  color: white;
  padding: 30px 20px;
  text-align: center;
  border-radius: 8px 8px 0 0;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5em;
  font-weight: 600;
`;

const Subtitle = styled.h2`
  margin: 10px 0 0;
  font-size: 1.2em;
  font-weight: 400;
  opacity: 0.9;
`;

const Section = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 1.8em;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 1.1em;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  font-size: 1em;
  resize: vertical;
`;

const SubmitButton = styled.button`
  background-color: #4169e1;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3158d3;
  }
`;

const ScannedData = styled.div`
  font-family: monospace;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const ImageSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const ImageUploadSection = styled.div`
  flex: 1;
`;

const CameraSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const WebcamContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const CaptureButton = styled.button`
  background-color: #4169e1;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3158d3;
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  margin-top: 10px;
  border-radius: 4px;
`;

const ImageAnalysisPanel = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin-top: 10px;
  line-height: 1.6;
  font-size: 0.95em;
  color: #2c3e50;
`;

const APIKeySection = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
`;

const APIKeyInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  font-size: 0.9em;
  &::placeholder {
    color: #999;
  }
`;

const SaveButton = styled.button`
  background-color: #4169e1;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3158d3;
  }
`;

const WarehouseProblemForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    palletId: 'PLT3962',
    timestamp: '2025-06-02T17:52:44.149Z',
    description: '',
    actionTaken: '',
    escalatedTo: '',
    additionalNotes: '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      initializeOpenAI(storedApiKey);
    }
  }, []);

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleApiKeySave = () => {
    localStorage.setItem('openai_api_key', apiKey);
    initializeOpenAI(apiKey);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      // Simulate image analysis
      analyzeImage(file);
    }
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Convert base64 to blob
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
            setSelectedImage(file);
            setImagePreviewUrl(imageSrc);
            // Simulate image analysis
            analyzeImage(file);
          });
      }
    }
  }, [webcamRef]);

  const analyzeImage = async (file: File) => {
    setImageAnalysis('Analyzing image...');
    
    try {
      // Convert File to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        try {
          const result = await analyzeImageAPI(base64Image);
          setImageAnalysis(result);
        } catch (error) {
          setImageAnalysis('Error analyzing image: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      };
    } catch (error) {
      setImageAnalysis('Error processing image: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, image: selectedImage });
  };

  return (
    <FormContainer>
      <Header>
        <Title>Warehouse Problem Solver</Title>
        <Subtitle>Quick Problem Resolution</Subtitle>
      </Header>

      <Section>
        <SectionTitle>Scanned Data:</SectionTitle>
        <ScannedData>
          {JSON.stringify(
            {
              palletId: formData.palletId,
              timestamp: formData.timestamp,
            },
            null,
            2
          )}
        </ScannedData>
      </Section>

      <form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Problem Details: General Ticket</SectionTitle>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="actionTaken">Action Taken</Label>
            <TextArea
              id="actionTaken"
              name="actionTaken"
              value={formData.actionTaken}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="escalatedTo">Escalated To (if applicable)</Label>
            <Input
              type="text"
              id="escalatedTo"
              name="escalatedTo"
              value={formData.escalatedTo}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Image</Label>
            <ImageSection>
              <ImageUploadSection>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreviewUrl && (
                  <ImagePreview src={imagePreviewUrl} alt="Preview" />
                )}
              </ImageUploadSection>
              
              <CameraSection>
                <CaptureButton
                  type="button"
                  onClick={() => setShowCamera(!showCamera)}
                >
                  {showCamera ? 'Hide Camera' : 'Click Image'}
                </CaptureButton>
                
                {showCamera && (
                  <WebcamContainer>
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width="100%"
                    />
                    <CaptureButton type="button" onClick={capture}>
                      Capture Photo
                    </CaptureButton>
                  </WebcamContainer>
                )}
              </CameraSection>
            </ImageSection>

            {imageAnalysis && (
              <ImageAnalysisPanel>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                  {imageAnalysis}
                </pre>
              </ImageAnalysisPanel>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <TextArea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
            />
          </FormGroup>

          <SubmitButton type="submit">Submit</SubmitButton>
        </Section>
      </form>

      <APIKeySection>
        <APIKeyInput
          type="password"
          placeholder="Enter OpenAI API Key"
          value={apiKey}
          onChange={handleApiKeyChange}
        />
        <SaveButton onClick={handleApiKeySave}>Save Key</SaveButton>
      </APIKeySection>
    </FormContainer>
  );
};

export default WarehouseProblemForm; 