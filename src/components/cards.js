import React from 'react'
import card from '../images/card.jpg'
import star from '../images/red-star.png'

export default function Card(){
    return(
        <div className='card'>
            <img className='card-image' src={card} alt='card'/>
            <div className='card-stats'>
                <img src={star} className='red-star' alt='red-star'/>
                <span> 4.0 </span>
                <span>(5) * </span>
                <span></span>
                <span>USA</span>
                <p>A girl from the Town</p>
                <p><b>$99 / person</b></p>
            </div>
        </div>
    )
}