import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toggleTheme, setTheme } from '../store/slices/themeSlice';

export const useTheme = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const dispatch = useDispatch();

  const toggle = () => dispatch(toggleTheme());
  const setDark = (dark: boolean) => dispatch(setTheme(dark));

  return { isDark, toggle, setDark };
};