'use client'
import { useState } from 'react';
import axios from 'axios';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Form = () => {
  const [botId1, setBotId1] = useState('');
  const [apiKey1, setApiKey1] = useState('');
  const [botId2, setBotId2] = useState('');
  const [apiKey2, setApiKey2] = useState('');
  const [response, setResponse] = useState('');
  const [uniqueProperties, setUniqueProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [pushResponse, setPushResponse] = useState('');

  const handleSelectProperty = (propertyName) => {
    setSelectedProperties((prevSelected) =>
      prevSelected.includes(propertyName)
        ? prevSelected.filter((name) => name !== propertyName)
        : [...prevSelected, propertyName]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response1 = await axios.get(
        `https://cloud.yellow.ai/cdp/api/v1/property?bot=${botId1}`,
        {
          headers: {
            'x-api-key': apiKey1,
          },
        }
      );

      const response2 = await axios.get(
        `https://cloud.yellow.ai/cdp/api/v1/property?bot=${botId2}`,
        {
          headers: {
            'x-api-key': apiKey2,
          },
        }
      );

      const propertiesData1 = response1.data.data.properties || [];
      const propertiesData2 = response2.data.data.properties || [];

      
      const uniquePropertiesArray = propertiesData1.filter((property) =>
        propertiesData2.every(
          (property2) =>
            property.name !== property2.name || property.type !== property2.type
        )
      );
      if (uniquePropertiesArray.length === 0) {
        //setResponse('No data found.');
        toast.error('No data found.');
        setUniqueProperties([]);
        return;
      }
      else{
        setUniqueProperties(uniquePropertiesArray);
      setResponse('');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      //setResponse('Error fetching data. Please check your inputs.');
      toast.error('Error fetching data. Please check your inputs.');
      setUniqueProperties([]);
    }
  };
  
  const handlePushTo  = async () => {
    try {
      const selectedPropertiesFormatted = {
        customProperty: selectedProperties.map((propertyName) => {
          const property = uniqueProperties.find(
            (prop) => prop.name === propertyName
          );
          return {
            name: property.name,
            type: property.type,
          };
        }),
      };

      const response = await axios.post(
        `https://cloud.yellow.ai/cdp/api/v1/property?bot=${botId2}`,
        selectedPropertiesFormatted,
        {
          headers: {
            'x-api-key': apiKey2,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Properties pushed to   successfully!', {
        onClose: () => {
          window.location.reload(); // Reload the page after the toast is closed
        }
      });
      //setPushResponse('Properties pushed to   successfully!');
    } catch (error) {
      console.error('Error pushing properties:', error);
      toast.error('Error pushing properties to  .');
      //setPushResponse('Error pushing properties to  .');
    }
  };

  return (
    <div className="card py-4">
      <div className="card-header">
        <h4>Get User Properties</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group py-2">
            <label htmlFor="botId1">Bot ID to Fetch Custom Properties</label>
            <input
              type="text"
              className="form-control"
              id="botId1"
              value={botId1}
              onChange={(e) => setBotId1(e.target.value)}
            />
          </div>
          <div className="form-group py-2">
            <label htmlFor="apiKey1">X-API-Key</label>
            <input
              type="text"
              className="form-control"
              id="apiKey1"
              value={apiKey1}
              onChange={(e) => setApiKey1(e.target.value)}
            />
          </div>
          <div className="form-group py-2">
            <label htmlFor="botId2">Bot ID to Push Custom Properties</label>
            <input
              type="text"
              className="form-control"
              id="botId2"
              value={botId2}
              onChange={(e) => setBotId2(e.target.value)}
            />
          </div>
          <div className="form-group py-2">
            <label htmlFor="apiKey2">X-API-Key</label>
            <input
              type="text"
              className="form-control"
              id="apiKey2"
              value={apiKey2}
              onChange={(e) => setApiKey2(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary py-auto">
            Submit
          </button>
        </form>
        {response && <div className="mt-3">{response}</div>}
        {uniqueProperties.length > 0 && (
          <div className="mt-3">
            <h5>Unique Properties:</h5>
            {uniqueProperties.map((prop, index) => (
              <div key={index} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`property-${index}`}
                  checked={selectedProperties.includes(prop.name)}
                  onChange={() => handleSelectProperty(prop.name)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`property-${index}`}
                >
                  {prop.name} ({prop.type})
                </label>
              </div>
            ))}
               <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={handlePushTo }
              disabled={selectedProperties.length === 0}
            >
              Push 
            </button>
            {pushResponse && <div className="mt-3">{pushResponse}</div>}
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Form;
