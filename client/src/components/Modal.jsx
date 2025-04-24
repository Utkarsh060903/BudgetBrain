// import React from "react";

// const Modal = ({ children, isOpen, onClose, title }) => {

//     if(!isOpen) return null
//   return (
//     <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-50">
//       <div className="relative p-4 w-full max-w-2xl max-h-full">
//         <div className="relative bg-white rounded-kg shadow-sm dark:bg-gray-700">
//           <div className="flex items-center justify-between p-4 md:p-5 rounded-t dark:border-gray-600 border-gray-200">
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>

//             <button className="text-gray-400 transaprent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer" type="button" onClick={onClose}>
//               X
//             </button>
//           </div>

//           <div className="p-4 md:p-5 space-y-4">{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;

import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl mx-4">
        <div className="relative bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>

            <button 
              className="text-gray-500 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center cursor-pointer" 
              type="button" 
              onClick={onClose}
            >
              X
            </button>
          </div>

          <div className="max-h-[80vh] overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;