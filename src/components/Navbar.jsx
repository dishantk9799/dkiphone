import React from 'react'
import { appleImg, bagImg, searchImg } from '../utils';
import { navLists } from '../constants';

function Navbar() {
    return (
        <section className='w-full py-5 px-5 flex justify-between items-center sm:px-10'>
            <nav className='flex w-full screen-max-width'>
                <img src={appleImg} alt="apple" height={18} width={14} />
                <div className='flex flex-1 justify-center max-sm:hidden'>
                    {navLists.map((nav, index) => (
                        <div key={index} className='px-5 text-sm cursor-pointer text-gray hover:text-white transition-all'>
                            {nav}
                        </div>
                    ))}
                </div>
                <div className='flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1'>
                    <img src={searchImg} alt="search" width={18} height={18} />
                    <img src={bagImg} width={18} height={18} alt="bag" />
                </div>
            </nav>
        </section>
    )
}

export default Navbar;
