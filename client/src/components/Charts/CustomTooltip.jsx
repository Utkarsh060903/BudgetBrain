import React from 'react'

const CustomTooltip = ({active, payLoad}) => {
    if(active && payLoad && payLoad.length){
        return (
            <div className='bg-white shadow-md rounded-lg py-2 border-gray-300'>
                <p className='ext-xs font-semibold text-purple-800 mb-1'>{payLoad[0].name}</p>
                <p className='text-sm text-gray-600'>Amount:{" "} <span className='text-sm font-medium text-gray-900'>${payLoad[0].value}</span></p>
            </div>
        )
    }
}

export default CustomTooltip
