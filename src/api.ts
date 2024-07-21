import { useEffect, useState } from "react"

const API_KEY = "986f9a1e95fa347bb34ff383dada721b"
const API_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODZmOWExZTk1ZmEzNDdiYjM0ZmYzODNkYWRhNzIxYiIsIm5iZiI6MTcyMTUzMTQwMC40NjgzNzgsInN1YiI6IjY2OWM2MzNiZGE3MzIwNDc1NjQ2NTY0MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.leEGaLjZrC2ES_tYOdFVeJ_RyVyhcA6nU6gTdtsW4Bc'

const BASE_PATH = 'https://api.themoviedb.org/3'

const IMG_PATH = 'https://image.tmdb.org/t/p/'

export interface IResult  {
backdrop_path: string,
genre_ids: number[],
id: number,
original_title: string,
overview: string,
poster_path: string,
release_date: string,
title: string
}

export interface IMovie {
    dates: {
        maximum: string,
        minimum: string
    }
    page: number,
    results: IResult[],
    total_pages: number,
    total_results:number
}

export const getMovie = () => fetch(`${BASE_PATH}/movie/now_playing?language=en-US&page=1`, {
    headers: {
        accept: 'application/json',
    Authorization: `Bearer ${API_ACCESS_TOKEN}`
    }
}).then(res => res.json()).catch(err => console.error('error: ' + err))

export const getPopularMovies = () => fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`, {
    headers: {
        accept: 'application/json',
    Authorization: `Bearer ${API_ACCESS_TOKEN}`
    }
}).then(res => res.json()).catch(err => console.error('error: ' + err))

interface IgetImg {
    (path: string ,
    format?: string,) : string

}

export const getImg: IgetImg = (path, format?) => `${IMG_PATH}/${format?format:"original"}/${path}}`


export function useWindowWidth(){
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(()=>{
        function handleResize(){
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return ()=> window.removeEventListener('resize', handleResize);
    },[]);
    return width
}
export interface IMovieDetails {
    backdrop_path: string;
    belongs_to_collection: {
        backdrop_path: string;
        id: number;
        name: string;
        poster_path: string;
    };
    genres: {
        id: string,
        name: string
    } [];
    homepage: string;
    id: number;
    imdb_id: string;
    origin_country: string[];
    original_language: string;
    original_title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    runtime: number;
    spoken_languages: {
        english_name: string;
        iso_639_1: string;
        name: string;
    }[];
    status: string;
    title: string;

}

export function getMovieDetails(movieId : string){
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_ACCESS_TOKEN}`
  }
};
return fetch(url, options).then(res => res.json()).catch(err => console.error('error: ' + err))
}