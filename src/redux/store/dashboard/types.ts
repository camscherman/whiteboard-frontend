export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export interface DashboardState {
  sidebarOpen: boolean;
}
interface ToggleSideBar {
  type: typeof TOGGLE_SIDEBAR;
}

export type DashboardActionTypes = ToggleSideBar;
