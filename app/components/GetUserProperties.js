'use client'
import { useState } from 'react';
import axios from 'axios';
import React from 'react';
const GetUserProperties = () => {
    const [botId, setBotId] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [response, setResponse] = useState('');
    const [apiResponse, setApiResponse] = useState(null);
    const [customProperties, setCustomProperties] = useState([]);
    const [selectedAll, setSelectedAll] = useState(false);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const handleSelectAll = () => {
        setSelectedAll(!selectedAll);
        setSelectedProperties(
            selectedAll ? [] : customProperties.map((prop) => prop.name)
        );
    };

    const handlePropertySelect = (propertyName) => {
        setSelectedAll(false);
        setSelectedProperties((prevSelected) =>
            prevSelected.includes(propertyName)
                ? prevSelected.filter((name) => name !== propertyName)
                : [...prevSelected, propertyName]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(
                `https://cloud.yellow.ai/cdp/api/v1/property?bot=${botId}`,
                {
                    headers: {
                        'x-api-key': apiKey,
                    },
                }
            );
            setApiResponse(response.data);
            setResponse('');
            const customProps = response.data.data.properties.filter(
                (prop) => prop.propertyType === 'Custom'
            );
            setCustomProperties(customProps);
        } catch (error) {
            console.error('Error fetching data:', error);
            setResponse('Error fetching data. Please check your inputs.');
            setApiResponse(null);
            setCustomProperties([]);
        }
    };
    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-md-12">
                    {/* Left Panel*/}
                    <div className="card py-4">
                        <div className="card-header">
                            <h4>Enter Bot Details to Get User Properties</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group py-2">
                                    <label htmlFor="botId">Bot ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="botId"
                                        value={botId}
                                        onChange={(e) => setBotId(e.target.value)} />
                                </div>
                                <div className="form-group py-2">
                                    <label htmlFor="apiKey">X-API-Key</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="apiKey"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-primary py-auto">
                                    Submit
                                </button>
                            </form>

                            {customProperties.length > 0 && (
                                <div className="mt-3">
                                    <h5>Custom Properties:</h5>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="selectAll"
                                            checked={selectedAll}
                                            onChange={handleSelectAll}
                                        />
                                        <label className="form-check-label" htmlFor="selectAll">
                                            Select All
                                        </label>
                                    </div>
                                    {customProperties.map((prop, index) => (
                                        <div key={index} className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={`property-${index}`}
                                                checked={selectedProperties.includes(prop.name)}
                                                onChange={() => handlePropertySelect(prop.name)}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={`property-${index}`}
                                            >
                                                {prop.name} ({prop.type})
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetUserProperties;
