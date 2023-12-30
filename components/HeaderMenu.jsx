import { Menu } from '@headlessui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BiMessageAltDetail } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { TbLogout2 } from "react-icons/tb";
import { BsPerson } from "react-icons/bs";
import { SlPeople } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { openModal } from "@/redux/features/friendsModalSlice";
import Link from "next/link";

const HeaderMenu = ({ user, onLogout }) => {
  const dispatch = useDispatch();

  const openModalHandler = async () => {
    dispatch(openModal());
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex flex-row-reverse justify-center items-center gap-1 w-full px-4 py-2 text-lg font-medium text-black bg-white rounded-md bg-opacity-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        {user.name} <FaChevronDown size={15} aria-hidden="true" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="px-1 py-1 ">
          <Menu.Item>
            {({ active }) => (
              <Link href="/users" className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-base`}>
                  <AiOutlineHome size={25} className='mr-2'/>
                  Home
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link href="/users/account" className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-base`}> {/* Change href url */}
                  <BsPerson size={25} className='mr-2'/>
                  Account
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button onClick={openModalHandler} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-base`}> {/* Change href url */}
                  <SlPeople size={25} className='mr-2'/>
                  Friends
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link href="/users/create-post" className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-base`}>
                  <BiMessageAltDetail size={25} className='mr-2'/>
                  Create Post
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
