'use client'


import { useState } from 'react';
import axios from 'axios';

function Form() {
    const [botId, setBotId] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(
                `https://cloud.yellow.ai/api/ai/botdata/table?bot=${botId}`,
                {
                    headers: {
                        'x-api-key': apiKey,
                    },
                }
            );
            setResponse(JSON.stringify(response.data));
        } catch (error) {
            console.error('Error fetching data:', error);
            setResponse('Error fetching data. Please check your inputs.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="botId" className="form-label">
                        Bot ID:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="botId"
                        value={botId}
                        onChange={(e) => setBotId(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="apiKey" className="form-label">
                        X-API-Key:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
            {response && <div className="mt-3">{response}</div>}
        </div>
    );
}

export default Form;


//botid = x1666154291877
//x-api-key = x1Bfgwp8VBFw73FzBrGaggufCFKQZ7OkpsLU5UZi