import IcoMoon from 'react-icomoon';
import { Svg, Path } from 'react-native-svg';
const iconSet = require('./selection.json');

const Icon = ({ ...props }) => {
  return (
    <IcoMoon
      native
      iconSet={iconSet}
      SvgComponent={Svg}
      PathComponent={Path}
      {...props}
      
    />
  );
};

export default Icon;