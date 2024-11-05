'use client';

import KidsSongs from './kidsSongs';
import KidsSongsMostView from './kidsSongsMostView';
import NewSerieses from './newSerieses';
import ZomurodaPlanet from './zomurodaSerieses';
import AdventuresPlanet from './adventuresSerieses';
import SportPlanet from './sportSerieses';
import ActionPlanet from './actionSerieses';
import BonbonaPlanet from './bonbonaSerieses';
import Movies from './movies';
import ZomurodaPlanetMostViewed from './zomurodaSeriesesMostViewed';
import SportPlanetMostViewed from './sportSeriesesMostViewed';
import AdventuresPlanetMostViewed from './adventuresSeriesesMostViewed';
import ActionPlanetMostViewed from './actionSeriesesMostViewed';
import MoviesPlanetMostViewed from './moviesMostViewed';
import BonbonaPlanetMostViewed from './bonbonaSeriesesMostViewed';
import SpacetoonSongs from './spacetoonSongs';
import SpacetoonSongsMostView from './spacetoonSongsMostView';
import NasohSeries from './nasohSeries';
export default function Serieses() {
  return (
    <div className="w-full">
      <NewSerieses />
      <NasohSeries />
      <ZomurodaPlanet />
      <ZomurodaPlanetMostViewed />
      <SpacetoonSongs />
      <SpacetoonSongsMostView />
      <AdventuresPlanet />
      <AdventuresPlanetMostViewed />
      <SportPlanet />
      <SportPlanetMostViewed />
      <ActionPlanet />
      <ActionPlanetMostViewed />
      <Movies />
      <MoviesPlanetMostViewed />
      <KidsSongs />
      <KidsSongsMostView />
      <BonbonaPlanet />
      <BonbonaPlanetMostViewed />
    </div>
  );
}
