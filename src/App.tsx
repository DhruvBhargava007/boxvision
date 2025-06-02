import { useState, useEffect } from 'react'
import ImageAnalyzer from './components/ImageAnalyzer'
import { initializeOpenAI } from './services/openai'
import './App.css'

function App() {
  const [apiKey, setApiKey] = useState('')

  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key')
    if (storedApiKey) {
      setApiKey(storedApiKey)
      initializeOpenAI(storedApiKey)
    }
  }, [])

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = event.target.value
    setApiKey(newApiKey)
    localStorage.setItem('openai_api_key', newApiKey)
    initializeOpenAI(newApiKey)
  }

  return (
    <div className="container">
      <div className="api-key-section">
        <p className="text-muted">
          Enter your OpenAI API key to get started
        </p>
        <input
          type="password"
          placeholder="Enter your OpenAI API key"
          value={apiKey}
          onChange={handleApiKeyChange}
          className="api-key-input"
        />
      </div>
      <ImageAnalyzer />
    </div>
  )
}

export default App
