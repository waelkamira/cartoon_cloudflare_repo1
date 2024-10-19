'use client';
import CurrentUser from '../../components/CurrentUser';
import ImageUpload from '../../components/ImageUpload';
import Button from '../../components/Button';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { inputsContext } from '../../components/Context';
import toast from 'react-hot-toast';
import Link from 'next/link';
import CustomToast from '../../components/CustomToast';
import BackButton from '../../components/BackButton';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { MdEdit } from 'react-icons/md';

export default function Profile() {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const user = CurrentUser();
  const { profile_image, dispatch } = useContext(inputsContext);
  const [newUserName, setNewUserName] = useState('');
  // console.log('user?.image', user?.image);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newName = JSON.parse(localStorage.getItem('CurrentUser'));
      setNewUserName(newName?.name);
    }
    // setNewImage(profile_image?.image);
    editProfileImageAndUserName();
  }, [profile_image?.image]);

  async function editProfileImageAndUserName() {
    if (profile_image?.image || newUserName) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('image', JSON.stringify(profile_image?.image));
      }
      // console.log('newUserName', newUserName);
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.data?.user?.email,
          image: profile_image?.image,
          name: newUserName,
        }),
      });
      if (response.ok) {
        toast.custom((t) => (
          <CustomToast t={t} message={'تم التعديل بنجاح '} greenEmoji={'✔'} />
        ));
        dispatch({ type: 'PROFILE_IMAGE', payload: profile_image?.image });
        if (typeof window !== 'undefined') {
          const newName = JSON.parse(localStorage.getItem('CurrentUser'));
          setNewUserName(newName?.name);
        }
      } else {
        toast.custom((t) => (
          <CustomToast t={t} message={'حدث حطأ ما حاول مرة أخرى 😐'} />
        ));
      }
    }
  }

  return (
    <div className="flex flex-col bg-white text-black h-screen justify-start items-start">
      {session?.status === 'unauthenticated' && (
        <div className="p-4 bg-four rounded-lg m-2 md:m-8 border border-one text-center h-screen">
          <h1 className="text-lg md:text-2xl p-2 my-8 text-white">
            يجب عليك تسجيل الدخول أولا لرؤية هذا البروفايل
          </h1>
          <div className="flex flex-col justify-between items-center gap-4 w-full">
            <Button title={'تسجيل الدخول'} style={''} path="/login" />

            {/* <BackButton /> */}
          </div>
        </div>
      )}
      {session?.status === 'authenticated' && (
        <div className="relative grow bg-gray-400 flex justify-start items-start w-full bg-four  xl:p-8 rounded-lg text-md sm:text-lg lg:text-xl">
          <div className="absolute flex flex-col items-start gap-2 z-50 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12 ">
            <TfiMenuAlt
              className=" p-1 rounded-lg text-3xl lg:text-5xl text-one cursor-pointer z-50  "
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            />
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          </div>
          <div className="flex flex-col items-start gap-4  justify-start w-full 2xl:w-2/3 h-full rounded-lg overflow-hidden">
            <div className="relative w-full flex justify-center p-2 mt-8">
              <div className="relative h-52 w-52 rounded-lg">
                <Image
                  priority
                  src={'https://i.imgur.com/ujGghEC.png'}
                  layout="fill"
                  objectFit="cover"
                  alt={user?.name}
                />
              </div>
              <div className="relative">
                {/* <MdOutlineAddPhotoAlternate className="absolute text-one text-xl -top-12 right-1 z-50" /> */}
              </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full text-start text-white">
              <div className="flex flex-col items-start gap-2 justify-between rounded-lg px-8 py-2 w-full my-2">
                <div className="flex justify-between items-center">
                  {/* <h5 className="text-sm">تغيير الإسم: </h5> */}
                  <h4 className="text-sm text-nowrap text-start w-full select-none">
                    <span className="text-black font-bold text-2xl ml-2">
                      #
                    </span>
                    <span className="text-black">الإسم : {user?.name} </span>
                  </h4>
                </div>

                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-white rounded-lg border-hidden" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 justify-between rounded-lg px-8 py-2 w-full my-2">
                <h4 className="text-sm text-black text-nowrap text-start w-full select-none">
                  <span className="text-black font-bold text-2xl ml-2">#</span>
                  الإيميل: {session?.data?.user?.email}
                </h4>

                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-white rounded-lg border-hidden" />
                </div>
              </div>

              {/* <div className="flex flex-col items-center gap-2 justify-between rounded-lg px-8 py-2 w-full my-2">
                <Link href={'/favoritePosts'} className="w-full">
                  <h1 className="text-nowrap text-start w-full select-none cursor-pointer ">
                    <span className="text-one font-bold text-2xl ml-2 ">#</span>
                    وصفات أعجبتني{' '}
                  </h1>
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
