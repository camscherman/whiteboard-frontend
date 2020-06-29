import {
  DashboardState,
  DashboardActionTypes,
  TOGGLE_SIDEBAR,
  TOGGLE_SIDEBAR_DARK,
  TOGGLE_BOTTOMBAR_OPEN,
  TOGGLE_BOTTOMBAR_DARK,
} from '../store/dashboard/types';

const initialState: DashboardState = {
  sidebarOpen: false,
  bottomBarOpen: false,
  sidebarDark: true,
  bottomBarDark: true,
};

export default function (state = initialState, action: DashboardActionTypes): DashboardState {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case TOGGLE_SIDEBAR_DARK:
      return { ...state, sidebarDark: !state.sidebarDark };
    case TOGGLE_BOTTOMBAR_OPEN:
      return { ...state, bottomBarOpen: !state.bottomBarOpen };
    case TOGGLE_BOTTOMBAR_DARK:
      return { ...state, bottomBarDark: !state.bottomBarDark };
    default:
      return state;
  }
}
