import {combineReducers} from 'redux';
import {loginReducer} from './login/reducer';
import {metamaskReducer} from './metamask/reducer';
import {MetamaskState} from './metamask/state';
import {OpenGameState} from './open-games/state';
import {openGamesReducer} from './open-games/reducer';
import {overlayReducer} from './global/reducer';
import {OverlayState} from './global/state';
import {GameState} from './game/state';
import {gameReducer} from './game/reducer';
import {WalletState, walletReducer} from './wallet/reducer';
import {LoginState} from './login/state';

export interface SiteState {
  login: LoginState;
  metamask: MetamaskState;
  wallet: WalletState;
  openGames: OpenGameState;
  game: GameState;
  overlay: OverlayState;
}

export default combineReducers<SiteState>({
  login: loginReducer,
  metamask: metamaskReducer,
  wallet: walletReducer,
  openGames: openGamesReducer,
  game: gameReducer,
  overlay: overlayReducer,
});
