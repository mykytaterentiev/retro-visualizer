import{defineStore}from'pinia'
export const useAuthStore=defineStore('auth',{state:()=>({authed:false}),persist:true})
