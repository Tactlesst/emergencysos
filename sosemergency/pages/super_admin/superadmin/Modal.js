
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export default function Modal({ children, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden'; // prevent background scroll
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
