export const useRoomState = () => {
  const state = useState('room', () => ({
    badges: [] as string[],      
    interactions: 0
  }))
  return { state }
}
