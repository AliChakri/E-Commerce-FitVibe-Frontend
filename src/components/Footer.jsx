
import React from 'react'

const Footer = () => {

    return (
    
        <footer className='w-full max-w-[80%] mx-auto mb-12 mt-32'>
            <section className='w-full h-[20vh] flex justify-between'>
                <div className=' flex-1 max-w-lg w-full'>
                    <a className="logo text-4xl font-bold mb-2">
                        FitVibe
                    </a>
                    <p className='max-w-lg'>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                        Eligendi doloribus doloremque ipsa voluptatibus id 
                        cupiditate excepturi in magni officiis quas.
                    </p>
                </div>
                <div className=' '>
                    <h3 className='text-xl font-semibold mb-2'>Company</h3>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div className=' '>
                    <h3 className='text-xl font-semibold mb-2'>Get IN Touch</h3>
                    <ul>
                        <li>+1-212-456-7890</li>
                        <li>contact@fitvibe.com</li>
                    </ul>
                </div>
            </section>
            <div className='w-full h-[5vh] flex items-center justify-center border-t '>
                Copyright{new Date().getFullYear()}@fitvibe.com - All Right Reserved
            </div>
        </footer>


    )
}

export default Footer