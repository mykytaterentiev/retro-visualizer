import{defineStore}from'pinia'
export const useSpotifyStore=defineStore('spotify',{state:()=>({top:[],playing:null}),persist:true})
