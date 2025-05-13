export const useSpotifyServer=async(event:any)=>{
    const cfg=useRuntimeConfig(event)
    return{token:cfg.spotifySecret}
  }

