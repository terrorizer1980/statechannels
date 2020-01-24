import {connect} from 'react-redux';

import ProfilePage from '../components/ProfilePage';
import {SiteState} from '../machines/reducer';

import * as gameActions from '../machines/game/actions';
import * as loginActions from '../machines/login/actions';

function mapStateToProps(state: SiteState) {
  return {};
}

const mapDispatchToProps = {
  updateProfile: gameActions.updateProfile,
  logout: loginActions.logoutRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
