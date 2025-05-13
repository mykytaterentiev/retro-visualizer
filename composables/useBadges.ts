export const useBadges=()=>{
    const{state}=useRoomState()
    watch(()=>state.value.interactions,(v)=>{
      if(v>=10&&!state.value.badges.includes('explorer'))state.value.badges.push('explorer')
    })
  }
  