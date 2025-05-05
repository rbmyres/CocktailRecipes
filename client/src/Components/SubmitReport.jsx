import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

function SubmitReport({recipe_id, onClose}) {
    const { authorized } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;

    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    // Sends request to create a new report

    const handleSubmit = async () => {
        if (!reason) {
            setError('Please pick a reason');
            return;
        }

        setError('');

        axios.post(`${API_URL}/report/${recipe_id}`, {reason, description})
            .then(() => {
                toast.success('Report submitted');
                onClose();
            })
            .catch((err) => {
                console.error(err);
                toast.error(err.response?.data?.error || 'Could not submit report');
            });
    }

  return (
    <div className='submitReportContainer'>
        <h1>Report</h1>
        <select className="submitReportSelect" value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">- Report Reason -</option>
            <option value="Dislike">I just don't like it</option>
            <option value="Harmful">Harmful Content</option>
            <option value="Harassment">Harassment</option>
            <option value="Violence">Violence</option>
            <option value="Spam">Spam</option>
            <option value="Else">Something else</option>
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