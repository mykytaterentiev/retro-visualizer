import{defineStore}from'pinia'
export const useRoomStore=defineStore('room',{state:()=>({badges:[]}),persist:true})
