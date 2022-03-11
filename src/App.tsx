import { useParams } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import Join from './views/join/Join';
import Lobby from './views/lobby/Lobby';
import Room from './views/room/Room';

const App = () => {
	const joined = useAppSelector((state) => state.room.joined);
	const inLobby = useAppSelector((state) => state.room.inLobby);

	const id = useParams().id?.toLowerCase() || 'invalid';

	if (joined)
		return (<Room />);
	else if (inLobby)
		return (<Lobby />);
	else
		return (<Join roomId={id} />);
};

export default App;