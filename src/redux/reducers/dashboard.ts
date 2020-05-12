import { DashboardState, DashboardActionTypes, TOGGLE_SIDEBAR } from '../store/dashboard/types';

const initialState: DashboardState = {
  sidebarOpen: false,
};

export default function (state = initialState, action: DashboardActionTypes): DashboardState {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      return state;
  }
}
