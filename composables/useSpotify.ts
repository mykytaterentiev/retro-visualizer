export const useSpotify=()=>{
    const topAlbums=useState<any[]>('topAlbums',()=>[])
    const playing=useState<any|null>('playing',()=>null)
    const fetchTop=async()=>{
      topAlbums.value=await $fetch('/api/spotify/top')
    }
    const playAlbum=async(id:string)=>{
      await $fetch('/api/spotify/play',{method:'POST',body:{id}})
      playing.value=id
    }
    return{topAlbums,playing,fetchTop,playAlbum}
  }
  