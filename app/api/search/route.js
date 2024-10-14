import { NextResponse } from 'next/server';
import Papa from 'papaparse';
export const runtime = 'edge';

// روابط ملفات CSV من GitHub
const csvUrls = {
  serieses:
    'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/serieses.csv',
  movies:
    'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/movies.csv',
  songs:
    'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/songs.csv',
  spacetoonSongs:
    'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/spacetoonSongs.csv',
  episodes:
    'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/episodes.csv',
};

// دالة لجلب وتحليل محتوى CSV من رابط
async function fetchCsvData(url) {
  const response = await fetch(url);
  const csvText = await response.text();
  return Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const searchTerm = searchParams.get('searchTerm') || '';
  const skip = (page - 1) * limit;

  try {
    const results = [];

    // قراءة وتحليل جميع ملفات CSV من الروابط
    const [serieses, movies, songs, spacetoonSongs, episodes] =
      await Promise.all(Object.values(csvUrls).map((url) => fetchCsvData(url)));

    // البحث في جدول serieses
    const filteredSeries = serieses
      .filter((item) =>
        item.seriesName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(skip, skip + limit);
    results.push(...filteredSeries);

    // البحث في جدول movies
    const filteredMovies = movies
      .filter((item) =>
        item.movieName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(skip, skip + limit);
    results.push(...filteredMovies);

    // البحث في جدول songs
    const filteredSongs = songs
      .filter((item) =>
        item.songName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(skip, skip + limit);
    results.push(...filteredSongs);

    // البحث في جدول spacetoonSongs
    const filteredSpacetoonSongs = spacetoonSongs
      .filter((item) =>
        item.spacetoonSongName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(skip, skip + limit);
    results.push(...filteredSpacetoonSongs);

    // البحث في جدول episodes
    const filteredEpisodes = episodes
      .filter((item) =>
        item.episodeName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(skip, skip + limit);
    results.push(...filteredEpisodes);

    // دمج النتائج وإرجاعها
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';
// import Papa from 'papaparse';

// // دالة لقراءة ملف CSV
// const readCSVFile = (fileName) => {
//   const filePath = path.join(process.cwd(), 'csv', `/${fileName}.csv`);
//   const fileContent = fs.readFileSync(filePath, 'utf8');

//   const { data } = Papa.parse(fileContent, {
//     header: true, // لتحديد أن الصف الأول هو العناوين
//     skipEmptyLines: true,
//   });

//   return data;
// };

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const page = parseInt(searchParams.get('page') || '1', 10);
//   const limit = parseInt(searchParams.get('limit') || '10', 10);
//   const searchTerm = searchParams.get('searchTerm') || '';
//   const skip = (page - 1) * limit;

//   try {
//     const results = [];

//     // البحث في جدول serieses
//     const serieses = readCSVFile('serieses');
//     const filteredSeries = serieses
//       .filter((item) =>
//         item.seriesName.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//       .slice(skip, skip + limit);
//     results.push(...filteredSeries);

//     // البحث في جدول movies
//     const movies = readCSVFile('movies');
//     const filteredMovies = movies
//       .filter((item) =>
//         item.movieName.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//       .slice(skip, skip + limit);
//     results.push(...filteredMovies);

//     // البحث في جدول songs
//     const songs = readCSVFile('songs');
//     const filteredSongs = songs
//       .filter((item) =>
//         item.songName.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//       .slice(skip, skip + limit);
//     results.push(...filteredSongs);

//     // البحث في جدول spacetoonSongs
//     const spacetoonSongs = readCSVFile('spacetoonSongs');
//     const filteredSpacetoonSongs = spacetoonSongs
//       .filter((item) =>
//         item.spacetoonSongName.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//       .slice(skip, skip + limit);
//     results.push(...filteredSpacetoonSongs);

//     // البحث في جدول episodes
//     const episodes = readCSVFile('episodes');
//     const filteredEpisodes = episodes
//       .filter((item) =>
//         item.episodeName.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//       .slice(skip, skip + limit);
//     results.push(...filteredEpisodes);

//     // دمج النتائج وإرجاعها
//     return NextResponse.json(results, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from 'next/server';
// import { supabase1 } from '../../../lib/supabaseClient1';

// export async function GET(req) {
//   const { searchParams } = new URL(req.url, 'http://localhost');
//   const page = parseInt(searchParams.get('page') || '1', 10);
//   const limit = parseInt(searchParams.get('limit') || '10', 10);
//   const searchTerm = searchParams.get('searchTerm') || '';
//   const skip = (page - 1) * limit;

//   try {
//     console.log('searchTerm', searchTerm);
//     const results = [];

//     // البحث في جدول serieses
//     let { data: series, error: seriesError } = await supabase1
//       .from('serieses')
//       .select('*')
//       .ilike('seriesName', `%${searchTerm}%`)
//       .range(skip, skip + limit - 1);

//     if (seriesError) throw seriesError;
//     results.push(...series);

//     // البحث في جدول movies
//     let { data: movies, error: moviesError } = await supabase1
//       .from('movies')
//       .select('*')
//       .ilike('movieName', `%${searchTerm}%`)
//       .range(skip, skip + limit - 1);

//     if (moviesError) throw moviesError;
//     results.push(...movies);

//     // البحث في جدول songs
//     let { data: songs, error: songsError } = await supabase1
//       .from('songs')
//       .select('*')
//       .ilike('songName', `%${searchTerm}%`)
//       .range(skip, skip + limit - 1);

//     if (songsError) throw songsError;
//     results.push(...songs);

//     // البحث في جدول spacetoonSongs
//     let { data: spacetoonSongs, error: spacetoonSongsError } = await supabase1
//       .from('spacetoonSongs')
//       .select('*')
//       .ilike('spacetoonSongName', `%${searchTerm}%`)
//       .range(skip, skip + limit - 1);

//     if (spacetoonSongsError) throw spacetoonSongsError;
//     results.push(...spacetoonSongs);

//     // البحث في جدول episodes
//     let { data: episodes, error: episodesError } = await supabase1
//       .from('episodes')
//       .select('*')
//       .ilike('episodeName', `%${searchTerm}%`)
//       .range(skip, skip + limit - 1);

//     if (episodesError) throw episodesError;
//     results.push(...episodes);

//     // دمج النتائج وإرجاعها
//     return NextResponse.json(results, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }
