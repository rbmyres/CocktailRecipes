import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '../AuthContext';

function SubmitReport({recipe_id, onClose}) {
    console.log('SubmitReport mounted for recipe', recipe_id);
    const { authorized } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;

    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!reason) {
            setError('Please pick a reason');
            return;
        }

        setError('');

        axios.post(`${API_URL}/report/${recipe_id}`, {reason, description}, {withCredentials: true})
            .then(() => {
                onClose();
            })
            .catch((err) => {
                console.error(err);
                setError(err.response?.data?.error || 'Could not submit report');
            });
    }

  return (
    <div className='submitReportContainer'>
        <h1>Report</h1>
        <select className="submitReportSelect" value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">- Report Reason -</option>
            <option value="dislike">I just don't like it</option>
            <option value="harmful">Harmful Content</option>
            <option value="harassment">Harassment</option>
            <option value="violence">Violence</option>
            <option value="spam">Spam</option>
            <option value="else">Something else</option>
        </select>
        <div className='submitReportText'>
            <div className='submitReportTextTitle'>Description:</div>
            <textarea maxLength='195' className='submitReportTextBox' onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        
        <button type='button' className='submitReportButton' onClick={handleSubmit}>Submit</button>

        <div className='reportStatus'>{error}</div>
    </div>

  )
}

export default SubmitReport