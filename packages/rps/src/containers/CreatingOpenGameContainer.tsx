import {connect} from 'react-redux';

import CreatingOpenGameModal from '../components/CreatingOpenGameModal';
import * as gameActions from '../machines/game/actions';

import {SiteState} from '../machines/reducer';

const mapStateToProps = (state: SiteState) => ({
  visible: state.game.localState.type === 'B.CreatingOpenGame',
});

const mapDispatchToProps = {
  createOpenGame: gameActions.createGame,
  cancelOpenGame: gameActions.cancelGame,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatingOpenGameModal);
