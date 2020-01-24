import {connect} from 'react-redux';

import LobbyPage from '../components/LobbyPage';
import * as actions from '../machines/game/actions';

import {SiteState} from '../machines/reducer';
import {OpenGame} from '../machines/open-games/state';

const mapStateToProps = (state: SiteState) => ({
  openGames: state.openGames as OpenGame[],
});

const mapDispatchToProps = {
  joinOpenGame: actions.joinOpenGame,
  newOpenGame: actions.newOpenGame,
};

export default connect(mapStateToProps, mapDispatchToProps)(LobbyPage);
