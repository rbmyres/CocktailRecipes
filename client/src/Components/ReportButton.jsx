import React, { useState } from 'react';
import { FaCircleExclamation } from "react-icons/fa6";
import SmallModal from './SmallModal';
import SubmitReport from './SubmitReport';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';


export function ReportButton({recipe_id}) {
  const { authorized } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!authorized ){
      navigate('/login');
    } else {
      setModalOpen(true);
    }
  }
  
  return (
    <>
     <button className='reportIcon' onClick={handleClick}><FaCircleExclamation /></button>

    <SmallModal open={modalOpen} onClose={() => setModalOpen(false)}>
      <SubmitReport recipe_id={recipe_id} onClose={() => setModalOpen(false)}/>
    </SmallModal>
    </>
  )
}