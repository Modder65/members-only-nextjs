import { Menu } from '@headlessui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BiMessageAltDetail } from "react-icons/bi";
import { TbLogout2 } from "react-icons/tb";
import Link from "next/link";

const HeaderMenu = ({ user, onLogout }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex flex-row-reverse justify-center items-center gap-1 w-full px-4 py-2 text-lg font-medium text-black bg-white rounded-md bg-opacity-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        {user.name} <FaChevronDown size={15} aria-hidden="true" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="px-1 py-1 ">
          <Menu.Item>
            {({ active }) => (
              <Link href="/users/create-post" className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-base`}>
                  <BiMessageAltDetail size={25} className='mr-2'/>
                  Post Message
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a onClick={onLogout} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-base cursor-pointer`}>
                <TbLogout2 size={25} className="mr-2"/>
                Log Out
              </a>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default HeaderMenu;
