import React from 'react'
import ReactDOM from 'react-dom'

function Modal({open, children, onClose}) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <>
    <div className='modalOverlay' onClick={ onClose }></div>
    <div className='modalContainer'>
      <div className='closeModalButton'>
        <svg className='closeModalIcon' onClick={onClose} xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#131112"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
      </div>
      { children }
    </div>
    </>,
    document.getElementById("portal")
  )
}

export default Modal;