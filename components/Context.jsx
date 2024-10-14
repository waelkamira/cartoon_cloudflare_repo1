'use client';
import React, { createContext, useReducer } from 'react';

function inputsReducer(currentState, action) {
  switch (action.type) {
    case 'SET_SERIESES':
      return {
        serieses: action?.payload,
      };
    case 'NEW_SERIES':
      // console.log('New_SERIES', action?.payload);
      return {
        newSeries: action?.payload,
      };
    case 'NEW_SONG':
      // console.log('NEW_SONG', action?.payload);
      return {
        newSong: action?.payload,
      };
    case 'KIDS_SONG_NAME':
      // console.log('KIDS_SONG_NAME', action?.payload);
      return {
        kidsSongName: action?.payload,
      };
    case 'SPACETOON_SONG_NAME':
      // console.log('SONG_NAME', action?.payload);
      return {
        SpacetoonSongName: action?.payload,
      };
    case 'NEW_SPACETOON_SONG':
      // console.log('NEW_SPACETOON_SONG', action?.payload);
      return {
        newSpacetoonSong: action?.payload,
      };
    case 'NEW_MOVIE':
      // console.log('NEW_MOVIE', action?.payload);
      return {
        newMovie: action?.payload,
      };
    case 'SELECTED_VALUE':
      // console.log('from Context', action?.payload);
      return {
        data: {
          ...currentState?.data,
          selectedValue: action.payload.selectedValue,
          modelName: action.payload.modelName,
        },
      };
    case 'DELETE_SERIES':
      // console.log('from Context', action?.payload);
      return {
        deletedSeries: {
          ...currentState?.data,
          selectedValue: action.payload.selectedValue,
          modelName: action.payload.modelName,
        },
      };
    case 'IMAGE':
      // console.log('image', action.payload);
      return {
        data: { ...currentState?.data, image: action.payload },
      };
    case 'PROFILE_IMAGE':
      return {
        profile_image: { image: action.payload },
      };

    case 'IMAGE_ERROR':
      return {
        imageError: action?.payload,
      };
    case 'ACTION':
      return {
        action: action?.payload,
      };
    case 'MY_SERIESES':
      return {
        mySerieses: action?.payload,
      };
    case 'FIRST_EPISODE':
      return {
        firstEpisode: action?.payload,
      };
    case 'IS_SONG_NAME':
      return {
        isSongName: action?.payload,
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
  });
  // console.log('from Context', state);

  return (
    <inputsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </inputsContext.Provider>
  );
}
