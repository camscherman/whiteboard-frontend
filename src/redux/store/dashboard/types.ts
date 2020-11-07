export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const TOGGLE_SIDEBAR_DARK = 'TOGGLE_SIDEBAR_DARK';
export const TOGGLE_BOTTOMBAR_OPEN = 'TOGGLE_BOTTOMBAR_OPEN';
export const TOGGLE_BOTTOMBAR_DARK = 'TOGGLE_BOTTOMBAR_DARK';
export interface DashboardState {
  sidebarOpen: boolean;
  sidebarDark: boolean;
  bottomBarOpen: boolean;
  bottomBarDark: boolean;
}
interface ToggleSideBar {
  type: typeof TOGGLE_SIDEBAR;
}
interface ToggleSideBarDark {
  type: typeof TOGGLE_SIDEBAR_DARK;
}

interface ToggleBottomBarOpen {
  type: typeof TOGGLE_BOTTOMBAR_OPEN;
}

interface ToggleBottomBarDark {
  type: typeof TOGGLE_BOTTOMBAR_DARK;
}

export type DashboardActionTypes =
  | ToggleSideBar
  | ToggleSideBarDark
  | ToggleBottomBarOpen
  | ToggleBottomBarDark;
