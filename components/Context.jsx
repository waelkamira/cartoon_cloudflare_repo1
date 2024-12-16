'use client';
import React, { createContext, useReducer } from 'react';

function inputsReducer(currentState, action) {
  switch (action.type) {
    case 'SET_SERIESES':
      return {
        ...currentState, // دمج الحالة السابقة
        serieses: action?.payload, // تحديث الخاصية
      };
    case 'NEW_SERIES':
      return {
        ...currentState,
        newSeries: action?.payload,
      };
    case 'NEW_SONG':
      return {
        ...currentState,
        newSong: action?.payload,
      };
    case 'KIDS_SONG_NAME':
      return {
        ...currentState,
        kidsSongName: action?.payload,
      };
    case 'SPACETOON_SONG_NAME':
      return {
        ...currentState,
        SpacetoonSongName: action?.payload,
      };
    case 'NEW_SPACETOON_SONG':
      return {
        ...currentState,
        newSpacetoonSong: action?.payload,
      };
    case 'NEW_MOVIE':
      return {
        ...currentState,
        newMovie: action?.payload,
      };
    case 'SELECTED_VALUE':
      return {
        ...currentState,
        data: {
          ...currentState?.data,
          selectedValue: action.payload.selectedValue,
          modelName: action.payload.modelName,
        },
      };
    case 'DELETE_SERIES':
      return {
        ...currentState,
        deletedSeries: {
          ...currentState?.data,
          selectedValue: action.payload.selectedValue,
          modelName: action.payload.modelName,
        },
      };
    case 'IMAGE':
      return {
        ...currentState,
        data: { ...currentState?.data, image: action.payload },
      };
    case 'PROFILE_IMAGE':
      return {
        ...currentState,
        profile_image: { image: action.payload },
      };
    case 'IMAGE_ERROR':
      return {
        ...currentState,
        imageError: action?.payload,
      };
    case 'ACTION':
      return {
        ...currentState,
        action: action?.payload,
      };
    case 'MY_SERIESES':
      return {
        ...currentState,
        mySerieses: action?.payload,
      };
    case 'FIRST_EPISODE':
      return {
        ...currentState,
        firstEpisode: action?.payload,
      };
    case 'IS_SONG_NAME':
      return {
        ...currentState,
        isSongName: action?.payload,
      };
    case 'RERENDER':
      return {
        ...currentState,
        rerender: !currentState.rerender, // عكس القيمة الحالية مباشرة
      };
    case 'PLAN':
      return {
        ...currentState,
        plan: !action?.payload,
      };
    case 'RERENDER_SUBSCRIBED_OR_NOT':
      return {
        ...currentState,
        rerender_subscribed_or_not: action?.payload,
      };
    case 'CHECK_SUBSCRIPTION':
      return {
        ...currentState,
        check_subscription: !action?.payload,
      };
    default:
      return currentState;
  }
}

export const inputsContext = createContext('');
export function InputsContextProvider({ children }) {
  const [state, dispatch] = useReducer(inputsReducer, {
    data: {},
    imageError: {},
    profile_image: {},
    serieses: [],
    newSeries: {},
    newSong: {},
    kidsSongName: {},
    firstEpisode: '',
    SpacetoonSongName: {},
    newSpacetoonSong: {},
    newMovie: {},
    deletedSeries: {},
    deleteFavoritePost: {},
    action: {},
    mySerieses: [],
    isSongName: '',
    rerender: false,
    plan: '',
    rerender_subscribed_or_not: false,
    check_subscription: false,
  });
  // console.log('from Context', state);

  return (
    <inputsContext.Provider value={{ state, dispatch }}>
      {children}
    </inputsContext.Provider>
  );
}
