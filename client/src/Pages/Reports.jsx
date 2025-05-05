import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useLoading } from '../LoadingContext';
import { useNavigate, Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";

function Reports() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { authorized } = useAuth();
    const { setLoading } = useLoading();
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [localLoading, setLocalLoading] = useState(true);
    const [error, setError] = useState(null);

    // Render all reports on load

    useEffect(() => {
        if (!authorized?.is_admin) {
          return navigate('/notfound');
        }
        
        setLocalLoading(true);
        setLoading(true);
    
        axios.get(`${API_URL}/report/reports`)
          .then(res => {
            setReports(res.data);
          })
          .catch(err => {
            console.error(err);
            setError('Failed to load reports');
          })
          .finally(() => {
            setLocalLoading(false);
            setLoading(false);
          });
      }, [API_URL, authorized, navigate, setLoading]);
    

    // Request to delete report when dismissed
    
    const handleDismiss = async (report_id) => {
        setLoading(true);
        try {
          await axios.delete(`${API_URL}/report/${report_id}`)
          setReports(reports.filter(r => r.report_id !== report_id))
        } catch (err) {
          console.error("Dismiss failed", err);
          setError("Could not dismiss report");
        } finally {
          setLoading(false);
        }
    }
    
    if (localLoading) return null;
    if (error) return <p>{error}</p>;



    return (
        <div className="reports">
            <div className="tableWrapper">            

            <table className="reportsTable">
                <thead>
                <tr>
                    <th>Report ID</th>
                    <th>Owner</th>
                    <th>Recipe</th>
                    <th>Reporter</th>
                    <th>Reason</th>
                    <th>Description</th>
                    <th>When</th>
                    <th>Dismiss</th>
                </tr>
                </thead>
                <tbody>
                {reports.map(rp => (
                    <tr key={rp.report_id}>
                    <td>{rp.report_id}</td>
                    <td><Link className='reportUserName'to={`/profile/${rp.owner_name}`}>{rp.owner_name}</Link></td>
                    <td><Link className='reportTitle'to={`/post/${rp.recipe_id}`}>{rp.recipe_title}</Link></td>
                    <td><Link className='reportUserName'to={`/profile/${rp.reporter_name}`}>{rp.reporter_name}</Link></td>
                    <td>{rp.report_reason}</td>
                    <td>{rp.report_description}</td>
                    <td>{new Date(rp.report_time).toLocaleString()}</td>
                    <td className="closeIcon"><IoClose onClick={() => handleDismiss(rp.report_id)}></IoClose></td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
  );
}

export default Reports;