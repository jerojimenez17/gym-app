"use client";
import React, { ReactElement } from "react";

interface props {
  visible: boolean;
  onClose: () => void;
  onAcept?: () => void;
  onCancel?: () => void;
  blockButton: boolean;
  link?: string;
  message?: string;
  children?: ReactElement;
  className?: string;
}
const Modal = ({
  visible,
  onClose,
  children,
  onAcept,
  className,
  message,
  onCancel,
  blockButton,
}: props) => {
  if (!visible) return null;
  return (
    <div
      className={`mx-auto w-full my-auto flex-col fixed inset-0 bg-black bg-opacity-25 backdrop-blur-md flex justify-center items-center z-50 ${className}`}
    >
      <div className="w-fit mx-auto flex flex-col h-[90vh]">
        <button
          className="text-white text-xl place-self-end hover:text-blue-300"
          onClick={onClose}
        >
          X
        </button>
        <div className=" bg-gradient-to-tr from-blue-300 to-blue-200  mx-auto align-middle bg-opacity-50 p-2 rounded w-full h-full overflow-auto flex flex-col">
          <div className="m-3 px-4 py-1 flex flex-col flex-grow mx-auto text-black font-semibold text-lg">
            {message ? message : children}
          </div>

          <div className="flex w-full h-12 justify-around">
            {onAcept && (
              <button
                disabled={blockButton}
                onClick={onAcept}
                className="p-2 bg-blue-400 selection:bg-opacity-50 text-white font-semibold rounded-2xl hover:shadow-md hover:shadow-blue-200"
              >
                Aceptar
              </button>
            )}
            {onCancel && (
              <button
                onClick={onCancel}
                className="p-2 border border-cyan-400 text-white font-semibold rounded-2xl shadow-sm shadow-white hover:text-black hover:font-bold hover:shadow-white"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
