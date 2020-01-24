import {connect} from 'react-redux';

import GameFooter from '../components/GameFooter';
import * as gameActions from '../machines/game/actions';
import {SiteState} from '../machines/reducer';

function mapStateToProps(state: SiteState) {
  const localState = state.game.localState;
  const localStateName = localState.type;
  const canChallenge = localStateName === 'A.ChooseWeapon'; // TODO revisit this
  const challengeOngoing = false; // TODO revisit this
  return {
    canChallenge,
    challengeOngoing,
  };
}
const mapDispatchToProps = {
  resign: gameActions.resign,
  createBlockchainChallenge: () => {
    /* TODO */
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(GameFooter);
