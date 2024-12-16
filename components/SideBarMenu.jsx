'use client';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import CurrentUser from '../components/CurrentUser';
import Image from 'next/image';
import Button from './Button';
import LoadingPhoto from './LoadingPhoto';
import ItemForSideBarMenu from './itemForSideBarMenu';
import { FaRegCreditCard } from 'react-icons/fa';

export default function SideBarMenu({ setIsOpen }) {
  const session = useSession();
  const user = CurrentUser();
  return (
    <div
      className="absolute w-full sm:w-fit h-screen z-50 right-0 top-0 border-l-[3px] border-white"
      onClick={() => setIsOpen(false)}
    >
      <div
        className=" w-64 bg-white z-50  h-screen overflow-y-auto "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 w-full z-50">
          <div className="flex justify-center items-center w-full cursor-pointer bg-one">
            <div className="relative size-36 my-2 mt-6 left-2">
              <Image
                loading="lazy"
                src={'https://i.imgur.com/nfDVITC.png'}
                fill
                alt={'photo'}
              />
            </div>
          </div>
          <div className="bg-white px-4">
            <Button title={'إغلاق'} onClick={() => setIsOpen(false)} />
          </div>
        </div>

        <div className="relative p-4 " onClick={() => setIsOpen(false)}>
          <ItemForSideBarMenu
            planetName={'كوكب زمردة'}
            planetImage={'https://i.imgur.com/wbjwdXO.png'}
            planetRoute={'/zomurodaPlanet'}
          />
          <ItemForSideBarMenu
            planetName={'كوكب مغامرات'}
            planetImage={'https://i.imgur.com/sUeBEaz.png'}
            planetRoute={'/adventuresPlanet'}
          />
          <ItemForSideBarMenu
            planetName={'كوكب رياضة'}
            planetImage={'https://i.imgur.com/CI7HaVo.png'}
            planetRoute={'/sportPlanet'}
          />
          <ItemForSideBarMenu
            planetName={'كوكب أكشن'}
            planetImage={'https://i.imgur.com/bg5hr5i.png'}
            planetRoute={'/actionPlanet'}
          />
          <ItemForSideBarMenu
            planetName={'كوكب أفلام'}
            planetImage={'https://i.imgur.com/QBreMYl.png'}
            planetRoute={'/moviesPlanet'}
          />
          <ItemForSideBarMenu
            planetName={'كوكب بون بونة'}
            planetImage={'https://i.imgur.com/DnKrRt2.png'}
            planetRoute={'/bonbonaPlanet'}
          />
          <ItemForSideBarMenu
            planetName={'أغاني سبيس تون'}
            planetImage={'https://i.imgur.com/BWPdDAF.png'}
            planetRoute={'/spacetoonSongsPlanet'}
          />
          <ItemForSideBarMenu
            planetName={'أغاني أطفال'}
            planetImage={'https://i.imgur.com/rRBpVhp.png'}
            planetRoute={'/songsPlanet'}
          />
          <ItemForSideBarMenu
            planetName={'كرتون لغة انجليزية'}
            planetImage={'https://i.imgur.com/bw6ZZCJ.png'}
            planetRoute={'/englishCartoonPlanet'}
          />
          <ItemForSideBarMenu
            planetName={'أغاني أطفال لغة انجليزية'}
            planetImage={'https://i.imgur.com/3PEEhLC.png'}
            planetRoute={'/englishSongsPlanet'}
          />
          <ItemForSideBarMenu
            planetName={'كرتون لغة تركية'}
            planetImage={'https://i.imgur.com/gfdEgLt.png'}
            planetRoute={'/turkishCartoonPlanet'}
          />
          <ItemForSideBarMenu
            planetName={'أغاني أطفال لغة تركية'}
            planetImage={'https://i.imgur.com/GTuV1My.png'}
            planetRoute={'/turkishSongsPlanet'}
          />

          {session?.status === 'unauthenticated' ? (
            <Button title={'تسجيل الدخول'} path={'/login'} />
          ) : (
            <Button title={'بروفايل'} path={'/profile'} />
          )}
        </div>
      </div>
    </div>
  );
}
